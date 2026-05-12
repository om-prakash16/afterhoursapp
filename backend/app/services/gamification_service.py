from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.gamification import UserProgress, Achievement
from datetime import datetime, date

class GamificationService:
    """
    Handles XP, Levels, and Streaks.
    """
    
    async def add_xp(self, user_id: int, amount: int, session: AsyncSession):
        # 1. Get current progress
        stmt = select(UserProgress).where(UserProgress.user_id == user_id)
        result = await session.execute(stmt)
        progress = result.scalar_one_or_none()
        
        if not progress:
            progress = UserProgress(user_id=user_id, xp=0, level=1)
            session.add(progress)
            await session.flush()
            
        progress.xp += amount
        
        # 2. Check for Level Up
        # Level Formula: XP needed = Level * 1000
        xp_needed = progress.level * 1000
        if progress.xp >= xp_needed:
            progress.level += 1
            progress.xp -= xp_needed
            # Trigger Level Up Event (e.g. Notification)
            
        await session.commit()
        return progress

    async def update_streak(self, user_id: int, session: AsyncSession):
        stmt = select(UserProgress).where(UserProgress.user_id == user_id)
        result = await session.execute(stmt)
        progress = result.scalar_one_or_none()
        
        if not progress: return
        
        today = date.today()
        if progress.last_activity:
            last_date = progress.last_activity.date()
            diff = (today - last_date).days
            
            if diff == 1:
                progress.current_streak += 1
                progress.max_streak = max(progress.max_streak, progress.current_streak)
            elif diff > 1:
                progress.current_streak = 1
        else:
            progress.current_streak = 1
            
        progress.last_activity = datetime.now()
        await session.commit()
        return progress

gamification_service = GamificationService()
