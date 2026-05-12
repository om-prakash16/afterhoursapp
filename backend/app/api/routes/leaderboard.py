from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.models.trading import Leaderboard
from app.models.trade_dna import TradeDNA
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/")
async def get_leaderboard(
    session: AsyncSession = Depends(get_db),
    current_user: Annotated[User, Depends(get_current_user)] = None
):
    # Query top 50 by consistency_score
    # In a real app, we'd join with User to get names
    from app.models.user import User
    
    query = (
        select(Leaderboard, User.full_name)
        .join(User, Leaderboard.user_id == User.id)
        .order_by(desc(Leaderboard.consistency_score))
        .limit(20)
    )
    
    result = await session.execute(query)
    rows = result.all()
    
    if not rows:
        # Seed dummy data for the demo
        return [
            {
                "rank": 1, 
                "name": "CryptoKing", 
                "score": 98.5, 
                "profit": "+24.2%", 
                "archetype": "Precision Architect",
                "discipline": 99,
                "safety": 98,
                "emotional": 97,
                "movement": "UP",
                "badges": ["SNIPER", "ZEN"]
            },
            {
                "rank": 2, 
                "name": "AuraMaster", 
                "score": 96.2, 
                "profit": "+18.1%", 
                "archetype": "Patient Strategist",
                "discipline": 95,
                "safety": 97,
                "emotional": 94,
                "movement": "STABLE",
                "badges": ["SHIELD", "ZEN"]
            },
            {
                "rank": 3, 
                "name": "BullRunner", 
                "score": 92.4, 
                "profit": "+42.5%", 
                "archetype": "Aggressive Scalper",
                "discipline": 88,
                "safety": 90,
                "emotional": 85,
                "movement": "DOWN",
                "badges": ["WHALE"]
            },
            {
                "rank": 4, 
                "name": "ZenTrader", 
                "score": 90.1, 
                "profit": "+12.0%", 
                "archetype": "Safe Haven Guard",
                "discipline": 92,
                "safety": 95,
                "emotional": 98,
                "movement": "UP",
                "badges": ["ZEN", "SHIELD"]
            },
            {
                "rank": 5, 
                "name": "HackathonHero", 
                "score": 88.7, 
                "profit": "+31.4%", 
                "archetype": "Balanced Builder",
                "discipline": 85,
                "safety": 89,
                "emotional": 82,
                "movement": "UP",
                "badges": ["SNIPER"]
            },
        ]
        
    return [
        {
            "rank": idx + 1,
            "name": row.full_name,
            "score": row.Leaderboard.consistency_score,
            "discipline": row.Leaderboard.discipline_score,
            "safety": row.Leaderboard.safety_score,
            "emotional": row.Leaderboard.emotional_score,
            "profit": f"+{row.Leaderboard.profit_percent}%",
            "trades": row.Leaderboard.trades_count,
            "movement": "UP" if (row.Leaderboard.previous_rank or 0) > (idx + 1) else "DOWN" if (row.Leaderboard.previous_rank or 0) < (idx + 1) else "STABLE",
            "badges": row.Leaderboard.badges.split(",") if row.Leaderboard.badges else []
        }
        for idx, row in enumerate(rows)
    ]
