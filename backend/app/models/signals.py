from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, Boolean, DateTime, func, Enum
from app.core.database import Base

class Signal(Base):
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True, index=True)
    leader_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset = Column(String(50), nullable=False)
    side = Column(String(10), nullable=False) # BUY/SELL
    entry_price = Column(DECIMAL(20, 8), nullable=False)
    stop_loss = Column(DECIMAL(20, 8))
    take_profit = Column(DECIMAL(20, 8))
    risk_level = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TranslatedSignal(Base):
    __tablename__ = "translated_signals"

    id = Column(Integer, primary_key=True, index=True)
    signal_id = Column(Integer, ForeignKey("signals.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    adjusted_size = Column(DECIMAL(20, 8))
    adjusted_stop_loss = Column(DECIMAL(20, 8))
    explanation = Column(String(500))
    status = Column(String(20), default="PENDING")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
