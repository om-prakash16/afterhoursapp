from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.trading import EmotionalCheck
from app.services.emotional_service import analyze_emotional_state
from app.api.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/emotions", tags=["emotions"])

class EmotionalCheckRequest(BaseModel):
    answers: Dict[str, Any]
    trade_intent: Dict[str, Any]

@router.post("/check")
async def perform_emotional_check(
    request: EmotionalCheckRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    # 1. Analyze the state
    analysis = analyze_emotional_state(request.answers)
    
    # 2. Save to DB
    check = EmotionalCheck(
        user_id=current_user.id,
        mood=analysis["mood"],
        detected_risk=analysis["detected_risk"],
        risk_level=analysis["risk_level"],
        questions_answers=request.answers,
        recommendation=analysis["recommendation"],
        trade_intent=request.trade_intent
    )
    
    session.add(check)
    await session.commit()
    await session.refresh(check)
    
    return {
        "id": check.id,
        "risk": analysis["detected_risk"],
        "level": analysis["risk_level"],
        "recommendation": analysis["recommendation"],
        "timestamp": check.created_at
    }

@router.get("/history")
async def get_emotional_history(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    result = await session.execute(
        select(EmotionalCheck)
        .where(EmotionalCheck.user_id == current_user.id)
        .order_by(EmotionalCheck.created_at.desc())
        .limit(10)
    )
    return result.scalars().all()
