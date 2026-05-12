from typing import Annotated, Any, List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.trading import Portfolio, Trade
import uuid

async def get_guarded_capital_stats(user_id: int, session: AsyncSession) -> Dict[str, Any]:
    # 1. Fetch Portfolio
    result = await session.execute(select(Portfolio).where(Portfolio.user_id == user_id))
    portfolio = result.scalars().first()
    
    if not portfolio:
        # Seed default for demo
        portfolio = Portfolio(user_id=user_id, total_balance=10000.0, available_margin=10000.0)
        session.add(portfolio)
        await session.commit()
    
    # 2. Fetch Open Trades for Risk Exposure
    open_trades_result = await session.execute(select(Trade).where(Trade.user_id == user_id, Trade.status == "OPEN"))
    open_trades = open_trades_result.scalars().all()
    
    risk_exposure = sum(t.size_usdt for t in open_trades)
    unrealized_pnl = sum(t.pnl_usdt for t in open_trades)
    
    # 3. Calculate Guarded Capital
    # Guarded Capital = Total Balance - (Active Risk Exposure)
    guarded_capital = float(portfolio.total_balance) - risk_exposure
    
    return {
        "total_balance": float(portfolio.total_balance),
        "guarded_capital": max(0, guarded_capital),
        "risk_exposure": risk_exposure,
        "unrealized_pnl": unrealized_pnl,
        "win_rate": portfolio.win_rate,
        "max_drawdown": portfolio.max_drawdown,
        "total_profit": float(portfolio.total_profit),
        "active_trades_count": len(open_trades),
        "currency": portfolio.currency
    }
