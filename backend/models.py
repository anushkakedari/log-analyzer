from sqlalchemy import Column, String, DateTime, Text, Integer
from sqlalchemy.sql import func
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    name = Column(String)
    avatar_url = Column(String)
    provider = Column(String)  # "google" or "github"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LogAnalysis(Base):
    __tablename__ = "log_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    raw_log = Column(Text, nullable=False)
    explanation = Column(Text)
    classification = Column(String)  # INFO, WARNING, ERROR, FATAL
    severity = Column(String)        # Low, Medium, High, Critical
    root_cause = Column(Text)
    fix_suggestions = Column(Text)
    platform = Column(String)        # Python, Node.js, Docker etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())