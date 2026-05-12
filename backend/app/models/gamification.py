from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, func, JSON
from app.core.database import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    
    current_streak = Column(Integer, default=0)
    max_streak = Column(Integer, default=0)
    last_activity = Column(DateTime(timezone=True))
    
    total_points = Column(Integer, default=0)
    unlocked_perks = Column(JSON, default=list) # List of strings
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    type = Column(String(50)) # DISCIPLINE, STREAK, PROFIT, SOCIAL
    name = Column(String(100))
    description = Column(String(255))
    icon = Column(String(50))
    
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())
    rarity = Column(String(20), default="COMMON") # COMMON, RARE, EPIC, LEGENDARY
