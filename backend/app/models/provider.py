from sqlalchemy import Column, Integer, String, Float, DateTime, func, JSON
from app.core.database import Base

class SignalProvider(Base):
    __tablename__ = "signal_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(500))
    avatar = Column(String(255))
    
    # Professional Metrics
    win_rate = Column(Float, default=0.0)
    avg_leverage = Column(Float, default=1.0)
    consistency_score = Column(Float, default=0.0)
    trust_score = Column(Float, default=0.0) # 0-100
    risk_level = Column(String(20)) # LOW, MEDIUM, HIGH
    
    # Stats
    total_signals = Column(Integer, default=0)
    subscribers_count = Column(Integer, default=0)
    pnl_all_time = Column(Float, default=0.0)
    
    performance_history = Column(JSON) # List of monthly PnL
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
