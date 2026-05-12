import uuid
from sqlalchemy import String, Float, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import AuditMixin
from app.core.database import Base

class TradeSignal(Base, AuditMixin):
    __tablename__ = "trade_signals"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    leader_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    
    asset: Mapped[str] = mapped_column(String(20), nullable=False) # e.g. BTC/USDT
    side: Mapped[str] = mapped_column(String(10), nullable=False) # BUY or SELL
    entry_price: Mapped[float] = mapped_column(Float, nullable=False)
    stop_loss: Mapped[float] = mapped_column(Float, nullable=True)
    take_profit: Mapped[float] = mapped_column(Float, nullable=True)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    original_risk: Mapped[float] = mapped_column(Float, default=1.0) # Leader's risk %

    # Relationships
    leader: Mapped["User"] = relationship("User", foreign_keys=[leader_id])
