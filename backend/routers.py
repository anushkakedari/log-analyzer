from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import LogAnalysis
from analyzer import analyze_log
import json

router = APIRouter()

class AnalyzeRequest(BaseModel):
    log_text: str
    user_id: str

class AnalyzeResponse(BaseModel):
    id: str
    explanation: str
    classification: str
    severity: str
    platform: str
    root_cause: str
    fix_suggestions: list
    fix_code: str
    fix_confidence: int

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest, db: Session = Depends(get_db)):
    if not request.log_text.strip():
        raise HTTPException(status_code=400, detail="Log text cannot be empty")

    if len(request.log_text) > 10000:
        raise HTTPException(status_code=400, detail="Log text too long (max 10,000 characters)")

    try:
        result = analyze_log(request.log_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Save to database
    log_entry = LogAnalysis(
        user_id=request.user_id,
        raw_log=request.log_text,
        explanation=result.get("explanation"),
        classification=result.get("classification"),
        severity=result.get("severity"),
        root_cause=result.get("root_cause"),
        fix_suggestions=json.dumps(result.get("fix_suggestions", [])),
        platform=result.get("platform"),
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    return {
        "id": log_entry.id,
        "explanation": result.get("explanation", ""),
        "classification": result.get("classification", "INFO"),
        "severity": result.get("severity", "Low"),
        "platform": result.get("platform", "Unknown"),
        "root_cause": result.get("root_cause", ""),
        "fix_suggestions": result.get("fix_suggestions", []),
        "fix_code": result.get("fix_code", ""),
        "fix_confidence": result.get("fix_confidence", 0),
    }

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    log_text: str
    analysis: dict
    messages: list[ChatMessage]
    user_id: str

@router.post("/chat")
def chat(request: ChatRequest):
    from groq import Groq
    import os

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    # Build conversation history for Groq
    system_prompt = f"""You are an expert software engineer helping a developer understand and fix a log/error.

Here is the log they are analyzing:
{request.log_text}

Here is the analysis already done:
- Classification: {request.analysis.get('classification')}
- Severity: {request.analysis.get('severity')}
- Platform: {request.analysis.get('platform')}
- Explanation: {request.analysis.get('explanation')}
- Root Cause: {request.analysis.get('root_cause')}
- Fix Suggestions: {request.analysis.get('fix_suggestions')}

Answer the developer's questions about this log clearly and concisely.
Keep responses short and practical — maximum 3-4 sentences.
Use simple language a junior developer can understand.
"""

    groq_messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        groq_messages.append({
            "role": msg.role,
            "content": msg.content
        })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=groq_messages,
        max_tokens=300,
        temperature=0.5,
    )

    reply = response.choices[0].message.content.strip()
    return {"reply": reply}

@router.get("/history/{user_id}")
def get_history(user_id: str, db: Session = Depends(get_db)):
    logs = db.query(LogAnalysis).filter(
        LogAnalysis.user_id == user_id
    ).order_by(LogAnalysis.created_at.desc()).all()

    return [
        {
            "id": log.id,
            "raw_log": log.raw_log[:100] + "..." if len(log.raw_log) > 100 else log.raw_log,
            "explanation": log.explanation,
            "classification": log.classification,
            "severity": log.severity,
            "platform": log.platform,
            "root_cause": log.root_cause,
            "fix_suggestions": json.loads(log.fix_suggestions) if log.fix_suggestions else [],
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]

# maintaining the history of analyzed logs for each user, allowing them to review past analyses and delete entries if needed
@router.delete("/history/{log_id}")
def delete_history(log_id: str, db: Session = Depends(get_db)):
    log = db.query(LogAnalysis).filter(LogAnalysis.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": "Deleted successfully"}

# shows analytics for a user's logs - total count, breakdown by severity/classification/platform, trends over time
@router.get("/analytics/{user_id}")
def get_analytics(user_id: str, db: Session = Depends(get_db)):
    logs = db.query(LogAnalysis).filter(
        LogAnalysis.user_id == user_id
    ).order_by(LogAnalysis.created_at.desc()).all()

    if not logs:
        return {
            "total": 0,
            "by_severity": [],
            "by_classification": [],
            "by_platform": [],
            "by_date": [],
        }

    # Total count
    total = len(logs)

    # By severity
    severity_counts = {}
    for log in logs:
        s = log.severity or "Unknown"
        severity_counts[s] = severity_counts.get(s, 0) + 1
    by_severity = [{"name": k, "value": v} for k, v in severity_counts.items()]

    # By classification
    class_counts = {}
    for log in logs:
        c = log.classification or "Unknown"
        class_counts[c] = class_counts.get(c, 0) + 1
    by_classification = [{"name": k, "value": v} for k, v in class_counts.items()]

    # By platform
    platform_counts = {}
    for log in logs:
        p = log.platform or "Unknown"
        platform_counts[p] = platform_counts.get(p, 0) + 1
    by_platform = [{"name": k, "value": v} for k, v in platform_counts.items()]

    # By date (last 7 days)
    from datetime import datetime, timedelta
    date_counts = {}
    for i in range(6, -1, -1):
        day = (datetime.utcnow() - timedelta(days=i)).strftime("%b %d")
        date_counts[day] = 0
    for log in logs:
        if log.created_at:
            day = log.created_at.strftime("%b %d")
            if day in date_counts:
                date_counts[day] += 1
    by_date = [{"date": k, "count": v} for k, v in date_counts.items()]

    return {
        "total": total,
        "by_severity": by_severity,
        "by_classification": by_classification,
        "by_platform": by_platform,
        "by_date": by_date,
    }

# pattern detection endpoint - identifies common log patterns for a user in the last 7 days

@router.get("/patterns/{user_id}")
def get_patterns(user_id: str, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta

    # Get logs from last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    logs = db.query(LogAnalysis).filter(
        LogAnalysis.user_id == user_id,
        LogAnalysis.created_at >= seven_days_ago
    ).order_by(LogAnalysis.created_at.desc()).all()

    if not logs:
        return {"patterns": []}

    # Group logs by classification + platform combination
    groups = {}
    for log in logs:
        # Extract first line of log as the key
        first_line = log.raw_log.strip().split('\n')[0][:80]
        key = f"{log.classification}_{log.platform}_{first_line}"

        if key not in groups:
            groups[key] = {
                "key": key,
                "classification": log.classification,
                "severity": log.severity,
                "platform": log.platform,
                "sample_log": first_line,
                "explanation": log.explanation,
                "count": 0,
                "last_seen": log.created_at.isoformat() if log.created_at else None,
            }
        groups[key]["count"] += 1

    # Only return groups that appear more than once
    patterns = [v for v in groups.values() if v["count"] > 1]
    patterns.sort(key=lambda x: x["count"], reverse=True)

    return {"patterns": patterns}