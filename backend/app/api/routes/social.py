from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel
import datetime

router = APIRouter(prefix="/social", tags=["social"])

class SocialPostCreate(BaseModel):
    content: str
    asset: Optional[str] = None
    trade_id: Optional[int] = None

@router.get("/feed")
async def get_social_feed(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    List global social feed with AI moderated content.
    """
    # Simulated Global Feed for Demo
    return [
        {
            "id": 1,
            "user": {"name": "Alpha Hunter", "rank": "ELITE"},
            "content": "Just closed a precision short on BTC. Aura's translation saved me from the 10:00 AM volatility spike.",
            "asset": "BTC/USDT",
            "reactions": 42,
            "comments": 12,
            "timestamp": "2024-05-12T19:45:00Z",
            "is_verified": True
        },
        {
            "id": 2,
            "user": {"name": "Safe Haven", "rank": "ANALYST"},
            "content": "Monitoring ETH liquidations near $2950. The macro trend is still heavily bullish, but the sentiment gauge is overheated. Patience is the ultimate strategy.",
            "asset": "ETH/USDT",
            "reactions": 28,
            "comments": 5,
            "timestamp": "2024-05-12T20:10:00Z",
            "is_verified": True
        },
        {
            "id": 3,
            "user": {"name": "Rookie01", "rank": "ROOKIE"},
            "content": "Finally achieved 'Strategist' rank! My discipline score is up to 85% thanks to the Zen Buffer protocol.",
            "asset": None,
            "reactions": 15,
            "comments": 8,
            "timestamp": "2024-05-12T20:25:00Z",
            "is_verified": False
        }
    ]

@router.post("/post")
async def create_social_post(
    post: SocialPostCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Post to the social feed with Aura AI Moderation.
    """
    # Simulated AI Moderation
    dangerous_keywords = ["scam", "pump", "all in", "guaranteed profit", "100x"]
    if any(k in post.content.lower() for k in dangerous_keywords):
        raise HTTPException(status_code=400, detail="Aura AI Moderation: Dangerous or spammy content detected. Please share responsible advice.")
        
    return {
        "status": "POSTED",
        "message": "Your insight has been archived to the global intelligence feed."
    }
