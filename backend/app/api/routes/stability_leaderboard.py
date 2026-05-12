from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
import random

router = APIRouter(prefix="/leaderboard/stability", tags=["leaderboard"])

@router.get("/")
async def get_stability_leaderboard(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Get users ranked by stability, emotional control, and discipline.
    """
    users = [
        {
            "rank": 1,
            "name": "ZenMaster_X",
            "archetype": "Precision Architect",
            "stability_score": 98,
            "emotional_control": 99,
            "discipline": 97,
            "drawdown": "0.4%",
            "badges": ["ZEN", "SHIELD", "CONSISTENT"],
            "movement": "STABLE"
        },
        {
            "rank": 2,
            "name": "Aura_Flow",
            "archetype": "Balanced Strategist",
            "stability_score": 95,
            "emotional_control": 92,
            "discipline": 96,
            "drawdown": "0.8%",
            "badges": ["ZEN", "ALPHA"],
            "movement": "UP"
        },
        {
            "rank": 3,
            "name": "Quiet_Titan",
            "archetype": "Guarded Capitalist",
            "stability_score": 92,
            "emotional_control": 95,
            "discipline": 90,
            "drawdown": "1.2%",
            "badges": ["SHIELD"],
            "movement": "DOWN"
        },
        {
            "rank": 4,
            "name": "Disciplined_Pulse",
            "archetype": "Analytical Scalper",
            "stability_score": 89,
            "emotional_control": 85,
            "discipline": 94,
            "drawdown": "1.5%",
            "badges": ["SNIPER"],
            "movement": "UP"
        },
        {
            "rank": 5,
            "name": "Crypto_Oracle",
            "archetype": "Trend Sentinel",
            "stability_score": 88,
            "emotional_control": 90,
            "discipline": 86,
            "drawdown": "1.8%",
            "badges": ["WHALE"],
            "movement": "STABLE"
        }
    ]
    return users
