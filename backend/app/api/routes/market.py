from fastapi import APIRouter
import random

router = APIRouter(prefix="/market", tags=["market"])

@router.get("/sentiment")
async def get_market_sentiment():
    # Simulate Fear & Greed index
    score = random.randint(20, 85)
    status = "NEUTRAL"
    if score < 30: status = "EXTREME FEAR"
    elif score < 45: status = "FEAR"
    elif score > 75: status = "EXTREME GREED"
    elif score > 60: status = "GREED"
    
    return {
        "score": score,
        "status": status,
        "dominant_bias": "BULLISH" if score > 50 else "BEARISH",
        "volatility_index": "HIGH" if score < 40 or score > 70 else "MODERATE",
        "trend_strength": random.randint(40, 95),
        "global_momentum": 0.82 if score > 50 else -0.45,
        "assets": [
            {"symbol": "BTC", "sentiment": "STRONG BULLISH", "momentum": 0.92},
            {"symbol": "ETH", "sentiment": "BULLISH", "momentum": 0.65},
            {"symbol": "SOL", "sentiment": "NEUTRAL", "momentum": 0.12},
            {"symbol": "USDT", "sentiment": "STABLE", "momentum": 0.00}
        ]
    }
@router.get("/events")
async def get_economic_events():
    """
    List upcoming market-moving macro events.
    """
    return [
        {
            "id": "e1",
            "name": "CPI Inflation Data",
            "date": "2026-05-14T13:30:00Z",
            "impact": "HIGH",
            "category": "MACRO",
            "sensitivity": "Portfolio Beta: 1.4x",
            "prediction": "Expected 3.1%, Aura Predicts 3.2% (Hawkish)"
        },
        {
            "id": "e2",
            "name": "Fed Interest Rate Decision",
            "date": "2026-05-15T19:00:00Z",
            "impact": "CRITICAL",
            "category": "FED",
            "sensitivity": "Liquidation Risk: +12%",
            "prediction": "Pause Expected. Focus on Powell Rhetoric."
        },
        {
            "id": "e3",
            "name": "ETH Token Unlock",
            "date": "2026-05-16T00:00:00Z",
            "impact": "MEDIUM",
            "category": "CRYPTO",
            "sensitivity": "ETH Exposure: High",
            "prediction": "Short-term sell pressure expected."
        }
    ]
