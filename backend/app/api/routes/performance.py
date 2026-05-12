from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
import random

router = APIRouter(prefix="/performance", tags=["performance"])

@router.get("/recovery-status")
async def get_recovery_status(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Check if Smart Recovery Mode should be active.
    """
    # Simulated Logic: Consecutive losses > 3 or Emotional Stability < 50%
    consecutive_losses = 4
    emotional_stability = 42
    
    is_active = consecutive_losses >= 3 or emotional_stability < 50
    
    return {
        "active": is_active,
        "consecutive_losses": consecutive_losses,
        "emotional_stability": emotional_stability,
        "is_on_cooldown": is_active,
        "duration_minutes": 60,
        "reason": "Emotional Volatility Detected",
        "calming_advice": "Your heart rate and execution speed indicate high stress. Biological resync protocol initiated.",
        "restrictions": {
            "max_leverage": "5x",
            "max_trades_per_day": 2,
            "required_cooldown_minutes": 60
        },
        "guidance": "Smart Recovery Mode active. Focus on high-confidence setups and institutional discipline. Leverage is capped at 5x to preserve capital."
    }

@router.get("/trade-scores")
async def get_trade_scores(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Get 1-100 scores for recent trades with improvement trends.
    """
    return {
        "scores": [
            {"id": 1, "asset": "BTC/USDT", "score": 88, "discipline": 92, "risk": 85, "emotion": 88, "timing": 85, "alignment": 90},
            {"id": 2, "asset": "ETH/USDT", "score": 42, "discipline": 30, "risk": 45, "emotion": 20, "timing": 65, "alignment": 50},
            {"id": 3, "asset": "SOL/USDT", "score": 74, "discipline": 80, "risk": 70, "emotion": 75, "timing": 60, "alignment": 85},
            {"id": 4, "asset": "BTC/USDT", "score": 95, "discipline": 98, "risk": 95, "emotion": 92, "timing": 95, "alignment": 95}
        ],
        "average_score": 75,
        "trend": "UPWARD",
        "improvement_summary": "Your discipline score has improved by 12% since the last recovery cycle. Focus on maintaining emotional stability during volatility spikes."
    }
