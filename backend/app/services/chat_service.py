from typing import Annotated, Any, List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.memory_service import memory_service
from app.models.conversation import Conversation
from app.models.memory import Memory
from app.models.trade_dna import TradeDNA
from app.models.signal import TradeSignal
from app.services.smart_copy_service import smart_copy_engine
import random

class ChatService:
    async def process_chat(self, db: AsyncSession, chat_request: ChatRequest) -> ChatResponse:
        user_message_lower = chat_request.message.lower()
        user_id = chat_request.user_id
        
        # 0. Check for Signal queries
        if any(word in user_message_lower for word in ["signal", "trade", "buy", "sell", "btc", "eth"]):
            # Fetch latest active signal
            signal_result = await db.execute(
                select(TradeSignal).where(TradeSignal.is_active == True).order_by(TradeSignal.created_at.desc()).limit(1)
            )
            signal = signal_result.scalar_one_or_none()
            
            if signal:
                # Get user DNA
                dna_result = await db.execute(select(TradeDNA).where(TradeDNA.user_id == user_id))
                dna = dna_result.scalar_one_or_none()
                
                if dna:
                    translation = smart_copy_engine.translate_signal(signal, dna)
                    reply_text = f"There's a live {signal.side} signal for {signal.asset} at {signal.entry_price}. Based on your {dna.archetype} DNA, I've translated this to a {translation['translated_size_percent']}% risk with a stop loss at {translation['adjusted_stop_loss']}. {translation['explanation']}"
                    
                    return ChatResponse(
                        response=reply_text,
                        mood_detected="focused",
                        suggested_actions=["Execute Trade", "Tell me more"]
                    )

        # 1. Fetch DNA context
        dna_result = await db.execute(select(TradeDNA).where(TradeDNA.user_id == user_id))
        dna = dna_result.scalar_one_or_none()

        # 2. Extract memory
        new_memories = await memory_service.extract_and_store_from_text(db, user_id, user_message)

        detected_mood = None
        for mem in new_memories:
            if mem.type == "mood":
                detected_mood = mem.value
                break

        # 3. Retrieve relevant memory
        words = [w for w in user_message.split() if len(w) > 3]
        matched_memories = []
        for word in words:
            results = await memory_service.search_memories(db, word, user_id)
            matched_memories.extend(results)
            
        new_memory_ids = {m.id for m in new_memories}
        relevant_memory = next((m for m in matched_memories if m.id not in new_memory_ids), None)

        # 4. Generate response with DNA context
        reply_text = self._generate_smart_response(user_message, detected_mood, relevant_memory, dna)

        # 2. Store conversation
        conversation = Conversation(
            user_id=user_id,
            message=user_message,
            response=reply_text,
            mood_detected=detected_mood
        )
        db.add(conversation)
        await db.commit()

        return ChatResponse(
            response=reply_text,
            mood_detected=detected_mood,
            suggested_actions=["Tell me more"]
        )

    def _generate_smart_response(self, user_message: str, detected_mood: Optional[str], matched_memory: Optional[Memory], dna: Optional[TradeDNA] = None) -> str:
        reply_parts = []
        
        # 1. ARCHETYPE TONE
        dna_prefix = ""
        if dna:
            if dna.archetype == "Safe Haven Guard":
                dna_prefix = "As your Guard, my priority is your capital preservation. "
            elif dna.archetype == "Aggressive Scalper":
                dna_prefix = "Velocity is our edge today. "
            elif dna.archetype == "Precision Architect":
                dna_prefix = "The setup is mathematically sound. "
            
        # 2. MOOD ACKNOWLEDGMENT
        if detected_mood:
            if detected_mood in ["stressed", "anxious", "overwhelmed"]:
                reply_parts.append(f"{dna_prefix}I notice you're feeling {detected_mood}. Given your {dna.archetype if dna else 'profile'}, maybe it's time to step back from the terminal?")
            elif detected_mood in ["excited", "joyful"]:
                reply_parts.append(f"{dna_prefix}It's great that you're feeling {detected_mood}, but let's stay disciplined. Euphoria is as dangerous as fear.")
            else:
                reply_parts.append(f"{dna_prefix}I hear you. You mentioned feeling {detected_mood}.")

        # 3. MEMORY REFERENCE
        if matched_memory:
            reply_parts.append(f"I remember we discussed {matched_memory.value} earlier. Is that still a factor in your strategy?")
        
        # 4. DEFAULT RESPONSES
        if not reply_parts:
            if dna and dna.archetype == "Safe Haven Guard":
                reply_parts.append("I'm monitoring the market volatility for you. No high-risk anomalies detected in your recent logs.")
            elif dna and dna.archetype == "Aggressive Scalper":
                reply_parts.append("The order books are moving fast. I'm here to ensure your execution stays precise.")
            else:
                reply_parts.append("I'm here, Commander. Ready to audit your next trade or just chat about the markets.")

        # 5. RISK WARNING (DNA-BASED)
        if dna and dna.risk_tolerance > 0.7 and (detected_mood in ["stressed", "angry"]):
            reply_parts.append("\n\n**WARNING:** High risk tolerance + Emotional stress detected. I recommend a 30-minute cooling-off period.")

        return " ".join(reply_parts)

chat_service = ChatService()
