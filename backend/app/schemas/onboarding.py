from typing import Annotated, Any, List, Dict, Optional
from pydantic import BaseModel

class OnboardingData(BaseModel):
    experience: str # e.g., 'Beginner', 'Intermediate', 'Expert'
    risk_tolerance: str # e.g., 'Conservative', 'Moderate', 'Aggressive'
    patience: int # 1-10
    aggression: int # 1-10
    account_size: float
    goals: List[str]
    preferred_assets: List[str]
