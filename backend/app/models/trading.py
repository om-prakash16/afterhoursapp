from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, JSON, Float, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import AuditMixin

class TradeProfile(Base, AuditMixin):
    __tablename__ = "trade_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    risk_tolerance = Column(String(50), default="MODERATE")
    investment_style = Column(String(100), default="Day Trading")
    bio = Column(String(500))
    preferred_assets = Column(JSON)

class Portfolio(Base, AuditMixin):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    total_balance = Column(DECIMAL(20, 8), default=10000.00)
    available_margin = Column(DECIMAL(20, 8), default=10000.00)
    
    total_profit = Column(DECIMAL(20, 8), default=0.00)
    win_rate = Column(Float, default=0.0)
    max_drawdown = Column(Float, default=0.0)
    
    currency = Column(String(10), default="USDT")

class Trade(Base, AuditMixin):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    asset = Column(String(50), index=True)
    side = Column(String(10)) # BUY/SELL
    entry_price = Column(Float)
    size_usdt = Column(Float)
    leverage = Column(Integer)
    
    status = Column(String(20), default="OPEN", index=True) # OPEN, CLOSED
    pnl_usdt = Column(Float, default=0.0)
    pnl_percent = Column(Float, default=0.0)
    
    # AI Discipline Tracking
    emotional_score = Column(Float)
    followed_advice = Column(Integer, default=1)
    risk_level = Column(String(20)) # LOW, MEDIUM, HIGH
    
    opened_at = Column(DateTime(timezone=True), server_default=func.now())
    closed_at = Column(DateTime(timezone=True))

class EmotionalCheck(Base, AuditMixin):
    __tablename__ = "emotional_checks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    mood = Column(String(50), index=True)
    detected_risk = Column(String(100)) # e.g., "REVENGE_TRADING"
    risk_level = Column(String(20)) # LOW, MEDIUM, HIGH
    
    questions_answers = Column(JSON)
    recommendation = Column(String(500))
    trade_intent = Column(JSON)

class Leaderboard(Base, AuditMixin):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    consistency_score = Column(Float, default=0.0)
    discipline_score = Column(Float, default=0.0)
    safety_score = Column(Float, default=0.0)
    emotional_score = Column(Float, default=0.0)
    
    profit_percent = Column(Float, default=0.0)
    trades_count = Column(Integer, default=0)
    
    current_rank = Column(Integer, index=True)
    previous_rank = Column(Integer)
    badges = Column(String(500))

class RiskLog(Base, AuditMixin):
    __tablename__ = "risk_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    account_balance = Column(Float)
    risk_percent = Column(Float)
    entry_price = Column(Float)
    stop_loss = Column(Float)
    
    calculated_leverage = Column(Integer)
    position_size_usdt = Column(Float)
    risk_amount_usdt = Column(Float)
    
    dna_archetype = Column(String(100), index=True)

class StopLossAdjustment(Base, AuditMixin):
    __tablename__ = "sl_adjustments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    signal_id = Column(Integer, index=True)
    
    original_sl = Column(Float)
    adjusted_sl = Column(Float)
    volatility_multiplier = Column(Float)
    dna_multiplier = Column(Float)
    reasoning = Column(String(500))

class Notification(Base, AuditMixin):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    type = Column(String(50), index=True) # SIGNAL, RISK, PORTFOLIO, SYSTEM
    title = Column(String(100))
    message = Column(String(500))
    is_read = Column(Integer, default=0)
