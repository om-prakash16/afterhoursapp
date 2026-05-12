from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.trade_dna import TradeDNA
from app.services.dna_service import get_archetype_description
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/dna", tags=["dna"])

@router.get("/me")
async def get_my_dna(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(TradeDNA).where(TradeDNA.user_id == current_user.id))
    dna = result.scalars().first()
    
    if not dna:
        raise HTTPException(status_code=404, detail="DNA profile not found. Please complete onboarding.")
    
    return {
        "score": dna.score,
        "archetype": dna.archetype,
        "description": get_archetype_description(dna.archetype),
        "metrics": {
            "risk_tolerance": dna.risk_tolerance,
            "aggression": dna.aggression,
            "patience": dna.patience,
            "discipline": dna.discipline,
            "emotional_control": dna.emotional_control
        },
        "updated_at": dna.updated_at
    }

