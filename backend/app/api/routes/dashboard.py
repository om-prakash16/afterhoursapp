from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.trading import Portfolio, Notification
from app.models.trade_dna import TradeDNA
from app.models.gamification import UserProgress

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
async def get_dashboard_summary(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    # 1. Get Portfolio
    portfolio_result = await db.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = portfolio_result.scalar_one_or_none()
    
    # 2. Get DNA
    dna_result = await db.execute(select(TradeDNA).where(TradeDNA.user_id == current_user.id))
    dna = dna_result.scalar_one_or_none()
    
    # 3. Get Progression
    prog_result = await db.execute(select(UserProgress).where(UserProgress.user_id == current_user.id))
    prog = prog_result.scalar_one_or_none()
    
    # 4. Recent Notifications
    notif_result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(3)
    )
    notifications = notif_result.scalars().all()
    
    return {
        "user": {
            "name": current_user.full_name,
            "email": current_user.email
        },
        "portfolio": {
            "total_balance": portfolio.total_balance if portfolio else 0,
            "guarded_capital": portfolio.guarded_capital if portfolio else 0,
            "pnl_24h": 4.2 # Mocked for now
        },
        "dna": {
            "archetype": dna.archetype if dna else "Analyzing...",
            "risk_tolerance": dna.risk_tolerance if dna else 0
        },
        "progression": {
            "level": prog.level if prog else 1,
            "xp": prog.xp if prog else 0,
            "next_level_xp": (prog.level if prog else 1) * 1000
        },
        "recent_alerts": notifications
    }
