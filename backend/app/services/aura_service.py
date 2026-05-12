from typing import Annotated, Any, List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.trade_dna import TradeDNA
from app.models.signals import Signal
from app.models.conversation import Conversation
import uuid

class AuraAssistant:
    """
    Aura is the intelligent trade assistant for AfterHours.
    She provides personalized advice based on User DNA and Market Signals.
    """
    
    async def get_response(self, user_id: uuid.UUID, message: str, session: AsyncSession) -> Dict[str, Any]:
        # 1. Fetch User Context
        dna_result = await session.execute(select(TradeDNA).where(TradeDNA.user_id == user_id))
        dna = dna_result.scalars().first()
        
        signal_result = await session.execute(select(Signal).where(Signal.is_active == True))
        signals = signal_result.scalars().all()
        
        # 2. Logic-based response (Simulating LLM with context-awareness)
        msg_lower = message.lower()
        response = ""
        mood = "NEUTRAL"
        
        if "dna" in msg_lower or "archetype" in msg_lower:
            response = f"Your current DNA is set to **{dna.archetype}**. This means you excel at {dna.patience * 100}% patience and {dna.discipline * 100}% discipline. I recommend sticking to the higher timeframe signals I've sent you today."
        
        elif "signal" in msg_lower or "trade" in msg_lower or "buy" in msg_lower:
            if signals:
                best_sig = signals[0]
                response = f"I'm tracking an institutional **{best_sig.side}** on **{best_sig.asset}** at ${best_sig.entry_price}. Based on your {dna.archetype} profile, I've adjusted the Stop Loss to ${best_sig.stop_loss * 0.98} for safety."
            else:
                response = "No high-conviction institutional signals detected in the last hour. I recommend staying in cash for now."
                
        elif "feel" in msg_lower or "scared" in msg_lower or "excited" in msg_lower:
            mood = "STRESSED" if "scared" in msg_lower else "EXCITED" if "excited" in msg_lower else "NEUTRAL"
            response = "I've logged your emotional state. Remember, trading from a place of high emotion often leads to deviation from your DNA parameters. Take a deep breath."
            
        else:
            response = "Commander, I'm standing by to help you translate institutional signals or audit your trading psychology. What's on your mind?"

        # 3. Save to History
        new_conv = Conversation(
            user_id=user_id,
            message=message,
            response=response,
            mood_detected=mood
        )
        session.add(new_conv)
        await session.commit()
        
        return {
            "response": response,
            "mood": mood,
            "archetype_context": dna.archetype if dna else "Neutral"
        }

aura = AuraAssistant()
