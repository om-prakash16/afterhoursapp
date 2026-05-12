from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.signals import Signal
from app.models.trade_dna import TradeDNA
from app.services.signal_service import signal_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/signals", tags=["signals"])

@router.get("/", response_model=None)
async def get_signals(
    session: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    result = await session.execute(select(Signal).where(Signal.is_active == True))
    signals = result.scalars().all()
    
    if not signals:
        return [
            {
                "id": 1,
                "asset": "BTC/USDT",
                "side": "BUY",
                "entry_price": 64200.50,
                "stop_loss": 62100.00,
                "take_profit": 68500.00,
                "provider": "CryptoKing",
                "confidence": 92,
                "risk_level": "MODERATE",
                "created_at": "2024-05-12T10:00:00Z"
            },
            {
                "id": 2,
                "asset": "SOL/USDT",
                "side": "SELL",
                "entry_price": 145.20,
                "stop_loss": 152.00,
                "take_profit": 128.00,
                "provider": "AuraMaster",
                "confidence": 85,
                "risk_level": "HIGH",
                "created_at": "2024-05-12T11:30:00Z"
            },
            {
                "id": 3,
                "asset": "ETH/USDT",
                "side": "BUY",
                "entry_price": 3450.00,
                "stop_loss": 3320.00,
                "take_profit": 3800.00,
                "provider": "ZenTrader",
                "confidence": 78,
                "risk_level": "LOW",
                "created_at": "2024-05-12T12:15:00Z"
            }
        ]
    return signals

@router.get("/personalized")
async def get_personalized_signals(
    session: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    # 1. Get all active signals
    result_signals = await session.execute(select(Signal).where(Signal.is_active == True))
    signals = result_signals.scalars().all()
    
    # If no real signals, use mock
    if not signals:
        signals = [
            Signal(id=1, asset="BTC/USDT", side="BUY", entry_price=64200.50, stop_loss=62100.00, take_profit=68500.00),
            Signal(id=2, asset="SOL/USDT", side="BUY", entry_price=145.20, stop_loss=138.00, take_profit=165.00)
        ]
    
    # 2. Get User DNA
    result_dna = await session.execute(select(TradeDNA).where(TradeDNA.user_id == current_user.id))
    dna = result_dna.scalars().first()
    
    if not dna:
        raise HTTPException(status_code=404, detail="Trade DNA not found. Complete onboarding.")

    # 3. Translate each signal
    personalized = []
    for sig in signals:
        translated = signal_service.translate_signal_for_user(sig, dna)
        personalized.append(translated)
        
    return personalized
