from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.trading import TradeProfile, Portfolio
from app.models.trade_dna import TradeDNA
from app.schemas.onboarding import OnboardingData

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

@router.post("/")
async def submit_onboarding(
    session: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    data: OnboardingData
) -> Any:
    """
    Submit onboarding data and generate Trade DNA.
    """
    # 1. Update or Create Trade Profile
    result = await session.execute(select(TradeProfile).where(TradeProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = TradeProfile(user_id=current_user.id)
        session.add(profile)
    
    profile.risk_tolerance = data.risk_tolerance.upper()
    profile.investment_style = data.experience
    profile.preferred_assets = data.preferred_assets
    profile.bio = f"Investor with {data.experience} experience. Goals: {', '.join(data.goals)}"

    # 2. Generate Trade DNA
    from app.services.dna_service import determine_archetype
    
    # Normalize inputs to 0.0 - 1.0
    risk_map = {"CONSERVATIVE": 0.2, "MODERATE": 0.5, "AGGRESSIVE": 0.8, "DEGEN": 1.0}
    exp_map = {"BEGINNER": 0.2, "INTERMEDIATE": 0.5, "ADVANCED": 0.8, "EXPERT": 1.0}
    
    risk_val = risk_map.get(data.risk_tolerance.upper(), 0.5)
    aggression_val = data.aggression / 10.0
    patience_val = data.patience / 10.0
    # Discipline is a mix of experience and patience
    discipline_val = (exp_map.get(data.experience.upper(), 0.5) + patience_val) / 2.0
    # Emotional control is linked to patience and experience for the start
    emo_control_val = (patience_val * 0.7) + (exp_map.get(data.experience.upper(), 0.5) * 0.3)
    
    archetype = determine_archetype(risk_val, aggression_val, patience_val, discipline_val, emo_control_val)
    
    result_dna = await session.execute(select(TradeDNA).where(TradeDNA.user_id == current_user.id))
    dna = result_dna.scalars().first()
    
    if not dna:
        dna = TradeDNA(user_id=current_user.id)
        session.add(dna)
    
    dna.risk_tolerance = risk_val
    dna.aggression = aggression_val
    dna.patience = patience_val
    dna.discipline = discipline_val
    dna.emotional_control = emo_control_val
    dna.archetype = archetype
    dna.score = (risk_val + aggression_val + patience_val + discipline_val + emo_control_val) / 5.0 * 100
    dna.details = {
        "experience_level": data.experience,
        "goals": data.goals,
        "patience_level": data.patience,
        "aggression_level": data.aggression
    }

    # 3. Initialize Portfolio
    result_portfolio = await session.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = result_portfolio.scalars().first()
    
    if not portfolio:
        portfolio = Portfolio(
            user_id=current_user.id,
            total_balance=data.account_size,
            available_margin=data.account_size
        )
        session.add(portfolio)
    else:
        portfolio.total_balance = data.account_size
        portfolio.available_margin = data.account_size

    await session.commit()
    
    return {
        "message": "Onboarding successful",
        "dna_category": dna.category,
        "dna_score": dna.score
    }
