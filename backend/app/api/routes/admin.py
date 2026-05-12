from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from app.core.database import get_db
from app.models.user import User
from app.models.trading import Trade, Portfolio
from app.models.trade_dna import TradeDNA
from app.api.deps import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

async def check_admin(current_user: Annotated[User, Depends(get_current_user)]):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

@router.get("/stats", dependencies=[Depends(check_admin)])
async def get_platform_stats(session: AsyncSession = Depends(get_db)):
    """
    Global platform metrics for administrators.
    """
    total_users = await session.scalar(select(func.count(User.id)))
    total_trades = await session.scalar(select(func.count(Trade.id)))
    total_volume = await session.scalar(select(func.sum(Trade.size_usdt)))
    
    # Archetype Distribution
    dna_result = await session.execute(
        select(TradeDNA.archetype, func.count(TradeDNA.id))
        .group_by(TradeDNA.archetype)
    )
    dna_dist = {row[0]: row[1] for row in dna_result.all()}
    
    return {
        "users_count": total_users,
        "trades_count": total_trades,
        "total_volume_usdt": float(total_volume) if total_volume else 0,
        "archetype_distribution": dna_dist,
        "platform_status": "HEALTHY"
    }

@router.get("/users", dependencies=[Depends(check_admin)])
async def list_all_users(session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(User).order_by(User.created_at.desc()))
    return result.scalars().all()

@router.get("/recent-trades", dependencies=[Depends(check_admin)])
async def list_recent_global_trades(session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(Trade, User.full_name)
        .join(User, Trade.user_id == User.id)
        .order_by(Trade.opened_at.desc())
        .limit(50)
    )
    trades = []
    for row in result.all():
        trade, name = row
        trades.append({
            "id": trade.id,
            "user": name,
            "asset": trade.asset,
            "side": trade.side,
            "size": trade.size_usdt,
            "pnl": trade.pnl_usdt,
            "status": trade.status
        })
    return trades
@router.get("/signals", dependencies=[Depends(check_admin)])
async def list_active_signals(session: AsyncSession = Depends(get_db)):
    from app.models.signals import Signal
    result = await session.execute(select(Signal).order_by(Signal.created_at.desc()))
    return result.scalars().all()

@router.get("/ai-logs", dependencies=[Depends(check_admin)])
async def list_ai_risk_logs(session: AsyncSession = Depends(get_db)):
    from app.models.trading import RiskLog
    result = await session.execute(select(RiskLog).order_by(RiskLog.created_at.desc()).limit(100))
    return result.scalars().all()

@router.put("/users/{user_id}/status", dependencies=[Depends(check_admin)])
async def update_user_status(user_id: int, is_active: bool, session: AsyncSession = Depends(get_db)):
    await session.execute(
        update(User).where(User.id == user_id).values(is_active=is_active)
    )
    await session.commit()
    return {"message": "User status updated"}

@router.get("/leaderboard", dependencies=[Depends(check_admin)])
async def list_leaderboard_admin(session: AsyncSession = Depends(get_db)):
    from app.models.trading import Leaderboard
    result = await session.execute(
        select(Leaderboard, User.full_name)
        .join(User, Leaderboard.user_id == User.id)
        .order_by(Leaderboard.consistency_score.desc())
    )
    return [
        {"id": r.Leaderboard.id, "name": r.full_name, "score": r.Leaderboard.consistency_score}
        for r in result.all()
    ]
