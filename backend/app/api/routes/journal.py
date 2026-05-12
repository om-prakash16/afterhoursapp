from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.trading import Trade

router = APIRouter(prefix="/journal", tags=["journal"])

@router.get("/")
async def get_trade_journal(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
    status: str = "CLOSED"
):
    """
    List historical trades with basic metrics.
    """
    query = select(Trade).where(Trade.user_id == current_user.id)
    if status:
        query = query.where(Trade.status == status)
    
    result = await db.execute(query.order_by(desc(Trade.opened_at)).limit(50))
    trades = result.scalars().all()
    
    # Enrich with AI Analysis (Simulated for Demo)
    enriched_trades = []
    for trade in trades:
        analysis = analyze_trade_behavior(trade)
        enriched_trades.append({
            "trade": trade,
            "ai_analysis": analysis
        })
        
    return enriched_trades

def analyze_trade_behavior(trade: Trade):
    """
    Advanced Aura Post-Trade Coaching Logic.
    Returns structured feedback across multiple behavioral dimensions.
    """
    is_win = trade.pnl_usdt > 0
    
    # Stability Feedback
    if trade.emotional_score > 0.8:
        stability = {"score": 95, "feedback": "Perfect Zen. No emotional drift detected.", "suggestion": "Keep your current pre-trade meditation routine."}
    elif trade.emotional_score > 0.5:
        stability = {"score": 65, "feedback": "Moderate tension detected during drawdown.", "suggestion": "Try reducing position size by 20% to stay within comfort zone."}
    else:
        stability = {"score": 20, "feedback": "Extreme panic. Logic was bypassed by stress.", "suggestion": "Mandatory 2-hour break after similar high-volatility events."}

    # Discipline Feedback
    if trade.followed_advice:
        discipline = {"score": 100, "feedback": "Followed DNA protocol perfectly.", "suggestion": "Your discipline is your edge. Trust the system."}
    else:
        discipline = {"score": 40, "feedback": "Deviated from SL/Leverage recommendations.", "suggestion": "Institutional signals require institutional discipline. Lock your leverage."}

    # Risk Feedback
    risk_score = 90 if trade.leverage <= 3 else (60 if trade.leverage <= 10 else 30)
    risk = {"score": risk_score, "feedback": f"Leverage utilized: {trade.leverage}x.", "suggestion": "Lower leverage increases your 'Time in Market'—the key to survival."}

    return {
        "summary": "Elite execution" if is_win and trade.followed_advice else "Behavioral Leakage",
        "categories": {
            "stability": stability,
            "discipline": discipline,
            "risk": risk
        }
    }
