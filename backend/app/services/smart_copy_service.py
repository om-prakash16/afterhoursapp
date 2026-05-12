from typing import Annotated, Any, List, Dict, Optional
from app.models.trade_dna import TradeDNA
from app.models.signal import TradeSignal

class SmartCopyEngine:
    """
    The core logic engine that translates a leader's signal 
    into a follower's specific action based on their Trade DNA.
    """
    
    def translate_signal(self, signal: TradeSignal, dna: TradeDNA) -> Dict[str, Any]:
        # 1. Calculate the 'Translation Factor'
        # If leader risk is 1.0, but follower risk tolerance is 0.2, we scale down.
        risk_multiplier = dna.risk_tolerance * 2.0 # Scale 0.5 to 1.0x
        
        # 2. Adjust Position Size
        suggested_size = signal.original_risk * risk_multiplier
        
        # 3. Adjust Stop Loss based on Patience/Aggression
        # Aggressive traders use tighter stops; Patient traders use wider stops.
        sl_adjustment = 1.0
        if dna.patience > 0.7:
            sl_adjustment = 1.2 # Give it more room
        elif dna.aggression > 0.7:
            sl_adjustment = 0.8 # Tighten it up
            
        adjusted_sl = signal.stop_loss
        if signal.stop_loss:
            price_diff = abs(signal.entry_price - signal.stop_loss)
            if signal.side == "BUY":
                adjusted_sl = signal.entry_price - (price_diff * sl_adjustment)
            else:
                adjusted_sl = signal.entry_price + (price_diff * sl_adjustment)
        
        # 4. Generate the DNA-specific execution plan
        return {
            "signal_id": str(signal.id),
            "asset": signal.asset,
            "side": signal.side,
            "entry_price": signal.entry_price,
            "translated_size_percent": round(suggested_size, 2),
            "adjusted_stop_loss": round(adjusted_sl, 2) if adjusted_sl else None,
            "dna_match_score": self._calculate_match_score(signal, dna),
            "explanation": self._generate_explanation(dna, suggested_size)
        }

    def _calculate_match_score(self, signal: TradeSignal, dna: TradeDNA) -> float:
        # Simplified match score logic
        return 0.85 # Mocked for now

    def _generate_explanation(self, dna: TradeDNA, size: float) -> str:
        if size < 0.5:
            return f"Scaled down to {size}% risk due to your Conservative DNA profile."
        return f"Aligned with your {dna.archetype} profile at {size}% risk."

smart_copy_engine = SmartCopyEngine()
