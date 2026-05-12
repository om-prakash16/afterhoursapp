import uuid
from sqlalchemy import String, UUID, ForeignKey, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import AuditMixin
from app.core.database import Base

class Conversation(Base, AuditMixin):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    message: Mapped[str] = mapped_column(Text, nullable=False)
    response: Mapped[str] = mapped_column(Text, nullable=False)
    mood_detected: Mapped[str] = mapped_column(String(50), nullable=True)
    
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="conversations")

    # Index for chronological retrieval per user
    __table_args__ = (
        Index("ix_conversations_user_created_at", "user_id", "created_at"),
    )
