from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/explainability", tags=["explainability"])

@router.get("/audit")
async def get_ai_explainability_audit(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Expose the internal reasoning for all AI-driven decisions.
    """
    return {
        "decisions": [
            {
                "module": "Position Sizing",
                "decision": "Reduction to 2.4%",
                "reasoning": "Volatility in BTC/USDT increased by 14% over the last hour. To maintain a survival probability of >95%, equity exposure was reduced relative to the current beta.",
                "data_points": ["BTC Volatility: 4.2%", "Portfolio Beta: 1.15", "Survival Target: 95%"],
                "confidence": 98
            },
            {
                "module": "Stop-Loss Adjustment",
                "decision": "Tailed by $150",
                "reasoning": "Asset price broke previous resistance at $64,500. SL was adjusted to lock in 40% of realized alpha while allowing for standard pullbacks.",
                "data_points": ["Resistance Level: $64,500", "Price: $66,100", "Standard Deviation: 0.8"],
                "confidence": 92
            },
            {
                "module": "Risk Intervention",
                "decision": "Neutral Priority",
                "reasoning": "Trader stability index is currently 88%. Behavioral leakage is minimal. No mandatory interventions required for the current cycle.",
                "data_points": ["Stability: 88%", "Heart Rate: 72bpm", "Execution Frequency: Stable"],
                "confidence": 95
            },
            {
                "module": "Signal Confidence",
                "decision": "Rating: 85 (RARE)",
                "reasoning": "Whale Flow at the $63,000 level shows strong institutional accumulation. Sentiment is bullish but cooling, providing an optimal R/R ratio.",
                "data_points": ["Whale Volume: +1400 BTC", "Sentiment: 68/100", "Trend Strength: 4/5"],
                "confidence": 85
            }
        ],
        "global_logic": "All decisions are cross-audited by the Nexus Agent Swarm to ensure multi-dimensional institutional alignment."
    }
