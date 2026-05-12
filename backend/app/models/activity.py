from sqlalchemy import Column, Integer, String, TEXT, ForeignKey, JSON, Boolean, DateTime, func
from app.core.database import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(TEXT, nullable=False)
    response = Column(TEXT, nullable=False)
    sentiment = Column(String(50))
    tokens_used = Column(Integer, default=0)
    context_metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), default="INFO")
    title = Column(String(255), nullable=False)
    message = Column(TEXT)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EmotionalCheck(Base):
    __tablename__ = "emotional_checks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    mood = Column(String(100), nullable=False)
    intensity = Column(Integer, default=5)
    notes = Column(TEXT)
    market_context = Column(TEXT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
