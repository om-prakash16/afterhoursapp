from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
import random

router = APIRouter(prefix="/psychology", tags=["psychology"])

@router.get("/timeline")
async def get_behavioral_timeline(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Get the correlated emotional and performance timeline.
    """
    # Simulated Timeline for Demo
    return {
        "events": [
            {"time": "09:00", "emotion": "CALM", "pnl": 0, "intensity": 20, "event": "Market Open"},
            {"time": "10:30", "emotion": "ANXIOUS", "pnl": -450, "intensity": 65, "event": "SL Hit (BTC)"},
            {"time": "11:15", "emotion": "PANIC", "pnl": -1200, "intensity": 88, "event": "Revenge Entry"},
            {"time": "14:00", "emotion": "ZEN", "pnl": 800, "intensity": 30, "event": "Aura Guided Exit"},
            {"time": "16:30", "emotion": "CONFIDENT", "pnl": 2400, "intensity": 75, "event": "Major Win"},
            {"time": "18:00", "emotion": "OVERCONFIDENT", "pnl": 2200, "intensity": 92, "event": "High Leverage Entry"}
        ],
        "patterns": [
            {
                "type": "REVENGE_LOOP",
                "severity": "HIGH",
                "message": "Detected high emotional intensity (88%) immediately following a loss at 10:30. Revenge trading cycle detected."
            },
            {
                "type": "OVERCONFIDENCE_SPIKE",
                "severity": "MEDIUM",
                "message": "Win at 16:30 resulted in dangerous overconfidence. Recommended leverage reduction for subsequent trades."
            }
        ],
        "peak_risk_hours": "10:00 AM - 12:00 PM",
        "stability_index": 64
    }
