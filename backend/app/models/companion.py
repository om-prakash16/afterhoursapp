from typing import Annotated, Any, List, Dict, Optional
import uuid
from sqlalchemy import String, UUID, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import AuditMixin
from app.core.database import Base

class Companion(Base, AuditMixin):
    __tablename__ = "companions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    persona: Mapped[Optional[str]] = mapped_column(Text)  # Description of AI personality
    mood: Mapped[str] = mapped_column(String(50), default="neutral")
    settings: Mapped[dict] = mapped_column(JSON, default=dict)
    
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="companions")
