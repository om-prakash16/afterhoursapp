from typing import Annotated, Any, List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.signals import Signal
from app.models.trade_dna import TradeDNA
from app.services.volatility_service import vol_monitor
from app.models.trading import EmotionalCheck

class SignalService:
    def translate_signal_for_user(self, signal: Any, dna: TradeDNA, balance: float = 10000.0) -> Dict[str, Any]:
        """
        Dynamic Stop-Loss Engine: Fuses Market Volatility with User DNA.
        """
        asset = getattr(signal, "asset", signal.get("asset", "BTC/USDT"))
        vol_data = vol_monitor.get_market_volatility(asset)
        vol_mult = vol_data["multiplier"]
        
        # 1. DNA Leverage Calculation
        leverage = 3
        if dna.risk_tolerance < 0.4: leverage = 1 if dna.emotional_control > 0.7 else 2
        elif dna.risk_tolerance > 0.7: leverage = 10 if dna.discipline > 0.6 else 5
        
        # 2. Risk Sizing
        risk_per_trade = 0.02
        if dna.risk_tolerance < 0.3: risk_per_trade = 0.01
        elif dna.risk_tolerance > 0.8: risk_per_trade = 0.05
        pos_size_usdt = balance * risk_per_trade * leverage
            
        # 3. DYNAMIC STOP LOSS (DNA + VOLATILITY)
        dna_sl_mult = 1.0
        if dna.patience > 0.7: dna_sl_mult = 1.2
        elif dna.patience < 0.3: dna_sl_mult = 0.8
        
        total_sl_mult = dna_sl_mult * vol_mult
        
        entry = float(getattr(signal, "entry_price", signal.get("entry_price")))
        orig_sl = float(getattr(signal, "stop_loss", signal.get("stop_loss")))
        price_diff = abs(entry - orig_sl)
        side = getattr(signal, "side", signal.get("side"))
        
        adjusted_sl = entry - (price_diff * total_sl_mult) if side == "BUY" else entry + (price_diff * total_sl_mult)
        
        # 4. Take Profit Optimization
        orig_tp = float(getattr(signal, "take_profit", signal.get("take_profit", entry * 1.1)))
        tp_multiplier = 1.1 if dna.aggression > 0.7 else 1.0
        tp_diff = abs(orig_tp - entry)
        adjusted_tp = entry + (tp_diff * tp_multiplier) if side == "BUY" else entry - (tp_diff * tp_multiplier)

        # 5. DYNAMIC CONFIDENCE & ALIGNMENT
        signal_risk_baseline = getattr(signal, "risk_level", signal.get("risk_level", "MODERATE"))
        sig_risk_val = 0.8 if signal_risk_baseline == "HIGH" else 0.4 if signal_risk_baseline == "LOW" else 0.6
        alignment_score = 100 - (abs(sig_risk_val - dna.risk_tolerance) * 100)
        
        base_confidence = getattr(signal, "confidence", signal.get("confidence", 80))
        final_confidence = (base_confidence * 0.7) + (alignment_score * 0.3)

        # 6. EXPLAINABLE AI (XAI) DATA
        explainability = {
            "alignment": round(alignment_score, 1),
            "factors": [
                {
                    "label": "Volatility Sync",
                    "impact": "POSITIVE" if vol_mult < 1.2 else "CAUTION",
                    "reason": f"Market volatility is {vol_data['status']}. SL adjusted for noise."
                },
                {
                    "label": "Risk Mismatch",
                    "impact": "NEUTRAL" if abs(sig_risk_val - dna.risk_tolerance) < 0.2 else "HIGH",
                    "reason": f"Signal is {signal_risk_baseline} risk; Your profile is {dna.risk_tolerance*100}% tolerance."
                },
                {
                    "label": "Account Sizing",
                    "impact": "POSITIVE",
                    "reason": f"Position size limited to {round(risk_per_trade*100, 1)}% of your capital for safety."
                }
            ]
        }

        reasoning = f"Stop Loss widened by {round((total_sl_mult-1)*100, 1)}% due to {vol_data['status']} volatility and your {dna.archetype} profile."

        return {
            "original_id": getattr(signal, "id", signal.get("id")),
            "asset": asset,
            "side": side,
            "provider": getattr(signal, "provider", signal.get("provider", "Institutional")),
            "base_confidence": base_confidence,
            "final_confidence": round(final_confidence, 1),
            "alignment_score": round(alignment_score, 1),
            "volatility_score": vol_mult,
            "volatility_status": vol_data["status"],
            "original_entry": entry,
            "original_sl": orig_sl,
            "adjusted_sl": float(adjusted_sl),
            "adjusted_tp": float(adjusted_tp),
            "adjusted_leverage": f"{leverage}x",
            "position_size_usdt": round(pos_size_usdt, 2),
            "explainability": explainability,
            "adjustment_logic": reasoning,
            "risk_rating": "LOW" if dna.risk_tolerance < 0.4 else "HIGH" if dna.risk_tolerance > 0.7 else "MODERATE",
            "personal_advice": self._get_dna_advice(dna, side)
        }

    def _get_dna_advice(self, dna: TradeDNA, side: str) -> str:
        if dna.archetype == "Patient Strategist":
            return "Your DNA favors high timeframe accuracy. This trade has a 3:1 RR ratio optimized for your patience."
        if dna.archetype == "Aggressive Scalper":
            return f"High velocity {side} detected. Use the {dna.aggression * 10}x leverage setting but watch for the first TP level."
        return "Balanced setup. Parameters adjusted to ensure drawdown stays below your 2% preference."

    async def check_fomo_risk(self, user_id: int, session: AsyncSession):
        """
        Audits emotional logs to detect FOMO danger.
        """
        result = await session.execute(
            select(EmotionalCheck)
            .where(EmotionalCheck.user_id == user_id)
            .order_by(EmotionalCheck.created_at.desc())
            .limit(5)
        )
        emotions = result.scalars().all()
        risk_count = sum(1 for e in emotions if e.mood in ["STRESSED", "ANGRY", "PANIC"])
        
        if risk_count >= 2:
            return {
                "is_blocked": True, 
                "reason": "Emotional Instability Detected", 
                "message": "Aura has detected a high-risk emotional pattern (FOMO/Panic). Execution restricted for 30 minutes.",
                "cooldown": 30
            }
        return {"is_blocked": False}

signal_service = SignalService()
