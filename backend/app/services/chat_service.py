from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.memory_service import memory_service
from app.models.conversation import Conversation
from app.models.memory import Memory
import random
from typing import Optional

class ChatService:
    async def process_chat(self, db: AsyncSession, chat_request: ChatRequest) -> ChatResponse:
        user_message = chat_request.message
        user_id = chat_request.user_id

        # 1. Extract memory
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

        # 4. Generate response
        reply_text = self._generate_smart_response(user_message, detected_mood, relevant_memory)

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

    def _generate_smart_response(self, user_message: str, detected_mood: Optional[str], matched_memory: Optional[Memory]) -> str:
        reply_parts = []
        
        # If mood detected -> acknowledge emotion
        if detected_mood:
            if detected_mood in ["happy", "excited", "joyful", "glad", "great", "awesome", "wonderful"]:
                reply_parts.append(f"I'm so glad to hear you're feeling {detected_mood}!")
            elif detected_mood in ["stressed", "anxious", "worried", "overwhelmed", "pressure", "tired", "sad", "depressed", "lonely", "unhappy", "down", "angry", "frustrated", "annoyed", "pissed", "mad"]:
                reply_parts.append(f"I'm sorry you're feeling {detected_mood}. I'm here for you.")
            else:
                reply_parts.append(f"I notice you're feeling {detected_mood}.")

        # If memory exists -> reference it
        if matched_memory:
            if matched_memory.type == "interest":
                reply_parts.append(f"Speaking of {matched_memory.value}, have you had time for that lately?")
            elif matched_memory.type == "mood":
                reply_parts.append(f"I remember previously you were feeling {matched_memory.value}.")
            else:
                reply_parts.append(f"I recall you mentioning {matched_memory.value}.")
        
        # Keep responses natural
        if not reply_parts:
            responses = [
                "That's interesting. Tell me more!",
                "I hear you. What else is on your mind?",
                "Got it. How can I help you further today?"
            ]
            reply_parts.append(random.choice(responses))
        else:
            # Add a natural continuation if we just acknowledged a mood/memory
            if not matched_memory and detected_mood:
                reply_parts.append("Want to talk about it?")
            elif matched_memory and not detected_mood:
                reply_parts.append("Is that still on your mind?")

        return " ".join(reply_parts)

chat_service = ChatService()
