from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.trading import RiskLog, Portfolio
from app.models.trade_dna import TradeDNA
from app.services.risk_service import risk_engine
from app.api.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel

from app.services.risk_score_service import risk_score_engine

router = APIRouter(prefix="/risk", tags=["risk"])

@router.get("/score")
async def get_user_risk_score(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    """
    Get the holistic risk score (0-100) based on behavior and performance.
    """
    return await risk_score_engine.calculate_user_risk_score(current_user.id, session)

class RiskCalculationRequest(BaseModel):
    entry_price: float
    stop_loss: float
    risk_percent: float = 2.0

@router.post("/calculate")
async def calculate_risk(
    request: RiskCalculationRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    # 1. Get User DNA
    dna_result = await session.execute(select(TradeDNA).where(TradeDNA.user_id == current_user.id))
    dna = dna_result.scalars().first()
    if not dna:
        raise HTTPException(status_code=400, detail="Trade DNA not found. Please complete onboarding.")
    
    # 2. Get User Portfolio Balance
    port_result = await session.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = port_result.scalars().first()
    balance = float(portfolio.total_balance) if portfolio else 10000.0 # Default for demo
    
    # 3. Calculate
    result = risk_engine.calculate_sizing(
        balance=balance,
        risk_percent=request.risk_percent,
        entry=request.entry_price,
        stop_loss=request.stop_loss,
        dna=dna
    )
    
    # 4. Save to Log
    log = RiskLog(
        user_id=current_user.id,
        account_balance=balance,
        risk_percent=request.risk_percent,
        entry_price=request.entry_price,
        stop_loss=request.stop_loss,
        calculated_leverage=int(result["leverage"]),
        position_size_usdt=result["final_size_usdt"],
        risk_amount_usdt=result["risk_amount_usdt"],
        dna_archetype=dna.archetype
    )
    session.add(log)
    await session.commit()
    
    return result

@router.get("/history")
async def get_risk_history(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    result = await session.execute(
        select(RiskLog)
        .where(RiskLog.user_id == current_user.id)
        .order_by(RiskLog.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()
@router.get("/cooldown-status")
async def get_cooldown_status(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    """
    Check if the user is currently under a 'Smart Cooldown' protocol.
    """
    score_data = await risk_score_engine.calculate_user_risk_score(current_user.id, session)
    
    # If score is > 70 (High Risk), trigger cooldown
    if score_data["score"] > 70:
        return {
            "is_on_cooldown": True,
            "reason": "HIGH BEHAVIORAL RISK",
            "message": "Aura has detected a high probability of behavioral leakage. Execution is paused to protect your capital.",
            "duration_minutes": 120,
            "calming_advice": "Step away from the screens. Take 10 deep breaths. The market will offer new opportunities once your mental clarity returns."
        }
        
    return {"is_on_cooldown": False}
