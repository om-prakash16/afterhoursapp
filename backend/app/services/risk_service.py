from typing import Annotated, Any, List, Dict, Optional
from app.models.trade_dna import TradeDNA

class RiskEngine:
    """
    Core engine for calculating safe position sizes.
    """
    
    def calculate_sizing(
        self, 
        balance: float, 
        risk_percent: float, 
        entry: float, 
        stop_loss: float, 
        dna: TradeDNA
    ) -> Dict[str, Any]:
        # 1. Calculate Risk Amount in USDT
        risk_amount_usdt = balance * (risk_percent / 100)
        
        # 2. Calculate Distance to Stop Loss
        sl_distance_percent = abs(entry - stop_loss) / entry
        
        # 3. Calculate Base Position Size (No Leverage)
        # Size = Risk / SL_Distance
        if sl_distance_percent == 0:
            return {"error": "Entry and Stop Loss cannot be the same"}
            
        base_size_usdt = risk_amount_usdt / sl_distance_percent
        
        # 4. Apply DNA-Based Leverage Cap
        # Even if the math says 50x, Aura might cap it at 5x for safety
        max_leverage = 10
        if dna.risk_tolerance < 0.4: max_leverage = 3
        elif dna.risk_tolerance > 0.8: max_leverage = 20
        
        # Adjust size based on leverage cap
        required_leverage = base_size_usdt / balance
        final_leverage = min(required_leverage, max_leverage)
        
        # If we hit the cap, we might need to reduce the size or tighten the stop
        final_size_usdt = balance * final_leverage
        
        # 5. Recommendation Logic
        recommendation = "Optimal size calculated."
        if final_leverage > 5:
            recommendation = "WARNING: High leverage detected. DNA suggests reducing size for this volatility."
        elif dna.discipline < 0.5:
            recommendation = "DNA Alert: Discipline score low. Sticking to 1% risk is strictly advised."

        return {
            "account_balance": balance,
            "risk_percent": risk_percent,
            "risk_amount_usdt": round(risk_amount_usdt, 2),
            "base_size_usdt": round(base_size_usdt, 2),
            "final_size_usdt": round(final_size_usdt, 2),
            "leverage": round(final_leverage, 1),
            "sl_distance_percent": round(sl_distance_percent * 100, 2),
            "recommendation": recommendation,
            "archetype": dna.archetype
        }

risk_engine = RiskEngine()
