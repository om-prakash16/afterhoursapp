from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.gamification import UserProgress, Achievement
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/gamification", tags=["gamification"])

@router.get("/profile")
async def get_gamification_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    # 1. Progress
    progress_stmt = select(UserProgress).where(UserProgress.user_id == current_user.id)
    progress = (await session.execute(progress_stmt)).scalar_one_or_none()
    
    # 2. Achievements
    ach_stmt = select(Achievement).where(Achievement.user_id == current_user.id)
    achievements = (await session.execute(ach_stmt)).scalars().all()
    
    if not progress:
        # Initial mock for demo
        return {
            "level": 4,
            "xp": 650,
            "xp_max": 4000,
            "streak": 5,
            "max_streak": 12,
            "achievements": [
                {"name": "Zen Master", "icon": "Brain", "description": "5 trades with perfect emotional control.", "rarity": "EPIC"},
                {"name": "Safety First", "icon": "Shield", "description": "Closed 10 trades with Stop Loss active.", "rarity": "COMMON"},
                {"name": "Alpha Hunter", "icon": "Zap", "description": "First profitable trade on an Aura signal.", "rarity": "RARE"}
            ]
        }
    
    persona_stages = ["ROOKIE", "STRATEGIST", "ANALYST", "ELITE TRADER"]
    level = progress.level if progress else 4
    persona = persona_stages[min(level // 10, 3)]
    
    return {
        "level": level,
        "xp": progress.xp if progress else 650,
        "xp_max": (progress.level if progress else 4) * 1000,
        "streak": progress.current_streak if progress else 5,
        "max_streak": progress.max_streak if progress else 12,
        "achievements": achievements if achievements else [
            {"name": "Zen Master", "icon": "Brain", "description": "5 trades with perfect emotional control.", "rarity": "EPIC"},
            {"name": "Safety First", "icon": "Shield", "description": "Closed 10 trades with Stop Loss active.", "rarity": "COMMON"},
            {"name": "Alpha Hunter", "icon": "Zap", "description": "First profitable trade on an Aura signal.", "rarity": "RARE"}
        ],
        "persona": {
            "stage": persona,
            "title": f"Institutional {persona.capitalize()}",
            "description": "Evolving based on behavioral stability and capital preservation metrics.",
            "progress_to_next": 45,
            "evolution_metrics": {
                "discipline": 88,
                "emotional_clarity": 92,
                "pnl_consistency": 74
            }
        }
    }
