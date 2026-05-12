from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
import random

router = APIRouter(prefix="/community", tags=["community"])

@router.get("/posts")
async def get_community_posts(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Get the social feed with AI risk labels and moderation flags.
    """
    return [
        {
            "id": "p1",
            "author": "AlphaWhale",
            "author_rank": "Elite",
            "content": "Just entered a 50x leverage long on BTC. Guaranteed profits, target $70k by tonight! 🚀🚀",
            "timestamp": "10m ago",
            "likes": 42,
            "comments": 12,
            "is_verified": False,
            "ai_moderation": {
                "flagged": True,
                "reason": "Dangerous Leverage & Fake Performance Claims",
                "risk_label": "SCAM RISK",
                "severity": "HIGH"
            }
        },
        {
            "id": "p2",
            "author": "Zen_Trader",
            "author_rank": "Strategist",
            "content": "Scaled into ETH at $2,450 following the Aura DNA translation. R/R ratio is currently 3.4. Stability remains key.",
            "timestamp": "25m ago",
            "likes": 128,
            "comments": 34,
            "is_verified": True,
            "trade_details": {
                "asset": "ETH/USDT",
                "entry": 2450,
                "leverage": "3x",
                "roi": "+12.4%"
            },
            "ai_moderation": {
                "flagged": False,
                "risk_label": "INSTITUTIONAL GRADE",
                "severity": "LOW"
            }
        },
        {
            "id": "p3",
            "author": "TrendSentinel",
            "author_rank": "Analyst",
            "content": "Community sentiment on SOL is reaching extreme greed levels. Seeing divergence in volume. Watch for the pullback.",
            "timestamp": "1h ago",
            "likes": 85,
            "comments": 19,
            "is_verified": True,
            "ai_moderation": {
                "flagged": False,
                "risk_label": "DATA BACKED",
                "severity": "LOW"
            }
        }
    ]

@router.get("/sentiment")
async def get_community_sentiment(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Get aggregated community sentiment across major assets.
    """
    return {
        "global_sentiment": 68,  # Bullish
        "trending_assets": [
            {"asset": "BTC", "sentiment": 72, "volume": "High", "ratio": 1.4},
            {"asset": "ETH", "sentiment": 55, "volume": "Medium", "ratio": 1.1},
            {"asset": "SOL", "sentiment": 84, "volume": "Extreme", "ratio": 2.2}
        ],
        "discussion_velocity": "Increasing",
        "top_keywords": ["Breakout", "Retest", "Whale Flow", "Leverage Flush"]
    }

@router.post("/post")
async def create_community_post(
    post_data: Dict[str, Any],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Create a new post with real-time AI moderation check.
    """
    content = post_data.get("content", "")
    
    # Simulated AI Moderation Engine logic
    is_toxic = "guaranteed" in content.lower() or "100x" in content.lower()
    
    if is_toxic:
        return {
            "success": False,
            "status": "BLOCKED",
            "reason": "Post contains prohibited language or high-risk claims."
        }
        
    return {
        "success": True,
        "status": "LIVE",
        "id": f"p{random.randint(100, 999)}"
    }
