import uuid
from sqlalchemy import String, Float, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import AuditMixin

class TradeDNA(Base, AuditMixin):
    __tablename__ = "trade_dna"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    
    # DNA Components (0.0 to 1.0)
    risk_tolerance: Mapped[float] = mapped_column(Float, default=0.5)
    aggression: Mapped[float] = mapped_column(Float, default=0.5)
    patience: Mapped[float] = mapped_column(Float, default=0.5)
    technical_bias: Mapped[float] = mapped_column(Float, default=0.5)
    
    # Metadata
    archetype: Mapped[str] = mapped_column(String(50), default="Neutral")
    settings: Mapped[dict] = mapped_column(JSON, default=dict)

    # Relationships
    user: Mapped["User"] = relationship("User", backref="trade_dna")
