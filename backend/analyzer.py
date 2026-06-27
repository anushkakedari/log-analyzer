from groq import Groq
import os
import json
from dotenv import load_dotenv
from rag import retrieve_similar_logs

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_log(log_text: str, user_id: str = None) -> dict:

    # Step 1 - retrieval
    similar_logs = []
    if user_id:
        similar_logs = retrieve_similar_logs(log_text, user_id)


    # step 2 - augmentation
    context = ""
    if similar_logs:
        context = """
IMPORTANT CONTEXT - This user has seen similar errors before:
"""
    for i, log in enumerate(similar_logs, 1):
        context += f"""
Similar Error {i} (Similarity: {log.get('similarity', 0):.0%}):
- Error: {log.get('raw_log', '')[:100]}
- What it was: {log.get('explanation', '')}
- Classification: {log.get('classification', '')}
- Platform: {log.get('platform', '')}
- Previous fix: {log.get('fix_suggestions', '')}
"""
    context += "\nUse this context to give more personalized advice.\n"

    # STEP 3 — GENERATION with augmented prompt
    prompt = f"""You are an expert software engineer and debugging assistant.
{context}
Analyze the following log, error, or stack trace and respond ONLY with a valid JSON object. No explanation outside the JSON. No markdown. No backticks.

Log to analyze:
{log_text}

Respond with this exact JSON structure:
{{
  "explanation": "Plain English explanation of what this log/error means (2-3 sentences, simple language)",
  "classification": "One of: INFO, DEBUG, WARNING, ERROR, FATAL",
  "severity": "One of: Low, Medium, High, Critical",
  "platform": "Detected platform/language e.g. Python, Node.js, Java, Docker, Kubernetes, Nginx, MySQL, etc.",
  "root_cause": "What actually caused this issue (1-2 sentences)",
  "fix_suggestions": [
    "First actionable step to fix this",
    "Second actionable step",
    "Third actionable step"
  ],
  "fix_code": "Optional: a short code snippet that fixes the issue, or empty string if not applicable",
  "fix_confidence": 85,
  "is_personalized": {str(bool(similar_logs)).lower()}
}}

Rules:
- fix_confidence is a number between 0 and 100
- Keep explanation simple enough for a junior developer
- fix_code should be in the correct language matching the log
- If the log is just informational (INFO), set severity to Low
- Be specific and practical in fix_suggestions
- If context from similar errors is provided, reference it in your explanation
- Return ONLY the JSON object, nothing else
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
        temperature=0.3,
    )

    response_text = response.choices[0].message.content.strip()

    if "```" in response_text:
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]
        response_text = response_text.strip()

    result = json.loads(response_text)
    result['similar_logs'] = similar_logs
    return result

