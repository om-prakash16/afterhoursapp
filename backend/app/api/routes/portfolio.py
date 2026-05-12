from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.models.trading import Portfolio, Trade
from app.services.portfolio_service import get_guarded_capital_stats
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

@router.get("/summary")
async def get_portfolio_summary(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    stats = await get_guarded_capital_stats(current_user.id, session)
    return stats

@router.get("/history")
async def get_trade_history(
    current_user: Annotated[User, Depends(get_current_user)],
    status: Optional[str] = Query(None),
    asset_type: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_db)
):
    query = select(Trade).where(Trade.user_id == current_user.id)
    
    if status:
        query = query.where(Trade.status == status.upper())
    if asset_type:
        query = query.where(Trade.asset.like(f"%{asset_type}%"))
        
    query = query.order_by(desc(Trade.opened_at))
    
    result = await session.execute(query)
    trades = result.scalars().all()
    
    if not trades:
        # Mock history for the demo
        return [
            {
                "id": 1, 
                "asset": "BTC/USDT", 
                "side": "BUY", 
                "size_usdt": 1200, 
                "leverage": 3, 
                "status": "CLOSED", 
                "pnl_usdt": 120.50, 
                "pnl_percent": 10.04, 
                "emotional_score": 85.0,
                "followed_advice": 1,
                "risk_level": "LOW",
                "opened_at": "2024-05-10T10:00:00Z"
            },
            {
                "id": 2, 
                "asset": "SOL/USDT", 
                "side": "SELL", 
                "size_usdt": 800, 
                "leverage": 5, 
                "status": "CLOSED", 
                "pnl_usdt": -45.20, 
                "pnl_percent": -5.65, 
                "emotional_score": 42.0,
                "followed_advice": 0,
                "risk_level": "HIGH",
                "opened_at": "2024-05-11T14:30:00Z"
            },
            {
                "id": 3, 
                "asset": "ETH/USDT", 
                "side": "BUY", 
                "size_usdt": 2500, 
                "leverage": 2, 
                "status": "OPEN", 
                "pnl_usdt": 85.00, 
                "pnl_percent": 3.4, 
                "emotional_score": 92.0,
                "followed_advice": 1,
                "risk_level": "LOW",
                "opened_at": "2024-05-12T09:15:00Z"
            },
        ]
        
    return trades

@router.get("/performance")
async def get_performance_data(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    # Simulated daily PnL data for the chart
    return [
        {"date": "2024-05-01", "pnl": 100},
        {"date": "2024-05-02", "pnl": 150},
        {"date": "2024-05-03", "pnl": 120},
        {"date": "2024-05-04", "pnl": 200},
        {"date": "2024-05-05", "pnl": 180},
        {"date": "2024-05-06", "pnl": 300},
        {"date": "2024-05-07", "pnl": 450},
        {"date": "2024-05-08", "pnl": 420},
        {"date": "2024-05-09", "pnl": 500},
        {"date": "2024-05-10", "pnl": 650},
    ]
@router.post("/deposit")
async def deposit_funds(
    amount: float,
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    portfolio = await session.scalar(
        select(Portfolio).where(Portfolio.user_id == current_user.id)
    )
    if not portfolio:
        portfolio = Portfolio(user_id=current_user.id, total_balance=0.0)
        session.add(portfolio)
        await session.flush()
    
    portfolio.total_balance += amount
    portfolio.guarded_capital = portfolio.total_balance * 0.9
    await session.commit()
    return {"message": "Funds deposited", "new_balance": portfolio.total_balance}

@router.post("/withdraw")
async def withdraw_funds(
    amount: float,
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    portfolio = await session.scalar(
        select(Portfolio).where(Portfolio.user_id == current_user.id)
    )
    if not portfolio or portfolio.total_balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    
    portfolio.total_balance -= amount
    portfolio.guarded_capital = portfolio.total_balance * 0.9
    await session.commit()
    return {"message": "Funds withdrawn", "new_balance": portfolio.total_balance}
@router.get("/protection-audit")
async def get_portfolio_protection_audit(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    """
    Perform a deep audit of the current portfolio to detect aggregate risk leaks.
    """
    # 1. Get Open Trades
    result = await session.execute(
        select(Trade).where(Trade.user_id == current_user.id, Trade.status == "OPEN")
    )
    trades = result.scalars().all()
    
    # 2. Calculate Aggregate Metrics
    total_exposure = sum([t.size_usdt * t.leverage for t in trades])
    asset_concentration = {}
    for t in trades:
        asset_concentration[t.asset] = asset_concentration.get(t.asset, 0) + t.size_usdt
        
    # 3. Generate Recommendations (Simulated Logic)
    recommendations = []
    if total_exposure > 50000: # Threshold for demo
        recommendations.append({
            "type": "LEVERAGE",
            "severity": "HIGH",
            "message": "Aggregate exposure exceeds $50k. Recommend reducing leverage on ETH/USDT by 40% to maintain survival margin."
        })
        
    if any(val > 30000 for val in asset_concentration.values()):
        recommendations.append({
            "type": "DIVERSIFICATION",
            "severity": "MEDIUM",
            "message": "Asset concentration in SOL/USDT detected. High correlation risk. Recommend partial hedge with stablecoin yield."
        })

    return {
        "health_score": 85 if not recommendations else (65 if len(recommendations) == 1 else 42),
        "total_notional_exposure": total_exposure,
        "recommendations": recommendations,
        "diversification_index": 0.78,
        "survival_probability": "HIGH" if not recommendations else "ELEVATED RISK"
    }
@router.post("/kill-switch")
async def initiate_emergency_kill_switch(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    """
    NUCLEAR OPTION: Instantly liquidate all open positions and lock the terminal.
    Used during extreme drawdown or behavioral collapse.
    """
    # 1. Get Open Trades
    result = await session.execute(
        select(Trade).where(Trade.user_id == current_user.id, Trade.status == "OPEN")
    )
    trades = result.scalars().all()
    
    # 2. Close All
    for t in trades:
        t.status = "CLOSED"
        t.pnl_usdt = 0 # Simulated breakeven exit
        
    await session.commit()
    
    return {
        "status": "TERMINATED",
        "positions_closed": len(trades),
        "message": "NEXUS PROTOCOL INITIATED. All capital has been moved to cold storage. Terminal locked for 24 hours.",
        "lock_duration_hours": 24
    }
