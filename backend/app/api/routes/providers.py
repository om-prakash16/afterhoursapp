from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.provider import SignalProvider

router = APIRouter(prefix="/providers", tags=["providers"])

@router.get("/")
async def list_providers(session: AsyncSession = Depends(get_db)):
    # Seed mock for demo if empty
    result = await session.execute(select(SignalProvider))
    providers = result.scalars().all()
    
    if not providers:
        return [
            {
                "id": 1,
                "name": "Alpha Prime Institutional",
                "description": "High-frequency quantitative analysis focusing on BTC and ETH major movements.",
                "avatar": "https://api.dicebear.com/7.x/identicon/svg?seed=alpha",
                "win_rate": 84.2,
                "avg_leverage": 5,
                "consistency_score": 96,
                "trust_score": 98,
                "risk_level": "LOW",
                "subscribers": 1240,
                "pnl": "+245.2%"
            },
            {
                "id": 2,
                "name": "Zenith Alpha",
                "description": "Safe haven strategy specializing in capital preservation during high volatility.",
                "avatar": "https://api.dicebear.com/7.x/identicon/svg?seed=zenith",
                "win_rate": 72.1,
                "avg_leverage": 2,
                "consistency_score": 92,
                "trust_score": 95,
                "risk_level": "LOW",
                "subscribers": 850,
                "pnl": "+112.5%"
            },
            {
                "id": 3,
                "name": "Volatility Hunter",
                "description": "Aggressive scalping desk targeting rapid liquidation clusters.",
                "avatar": "https://api.dicebear.com/7.x/identicon/svg?seed=hunter",
                "win_rate": 68.5,
                "avg_leverage": 15,
                "consistency_score": 85,
                "trust_score": 88,
                "risk_level": "HIGH",
                "subscribers": 3100,
                "pnl": "+420.8%"
            }
        ]
    return providers

@router.get("/{provider_id}")
async def get_provider_details(provider_id: int, session: AsyncSession = Depends(get_db)):
    # Detailed profile logic
    return {
        "id": provider_id,
        "name": "Alpha Prime Institutional",
        "performance_history": [
            {"month": "Jan", "pnl": 12},
            {"month": "Feb", "pnl": 18},
            {"month": "Mar", "pnl": 15},
            {"month": "Apr", "pnl": 22},
        ],
        "signals_count": 124,
        "avg_profit_per_signal": "+2.4%",
        "top_asset": "BTC/USDT"
    }
