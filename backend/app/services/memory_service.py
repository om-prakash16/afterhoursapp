import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.memory import Memory
from app.schemas.memory import MemoryCreate
from app.services.extraction_service import extraction_service

class MemoryService:
    async def store_memory(self, db: AsyncSession, memory_in: MemoryCreate) -> Memory:
        new_memory = Memory(
            type=memory_in.type,
            value=memory_in.value,
            user_id=memory_in.user_id
        )
        db.add(new_memory)
        await db.commit()
        await db.refresh(new_memory)
        return new_memory

    async def get_user_memories(self, db: AsyncSession, user_id: uuid.UUID) -> List[Memory]:
        result = await db.execute(
            select(Memory).where(Memory.user_id == user_id).order_by(Memory.created_at.desc())
        )
        return result.scalars().all()

    async def search_memories(self, db: AsyncSession, query: str, user_id: Optional[uuid.UUID] = None) -> List[Memory]:
        stmt = select(Memory).where(
            or_(
                Memory.type.ilike(f"%{query}%"),
                Memory.value.ilike(f"%{query}%")
            )
        )
        if user_id:
            stmt = stmt.where(Memory.user_id == user_id)
        
        result = await db.execute(stmt)
        return result.scalars().all()

    async def extract_and_store_from_text(self, db: AsyncSession, user_id: uuid.UUID, text: str) -> List[Memory]:
        """
        Extracts insights from text and stores them as memories.
        """
        insights = extraction_service.extract_insights(text)
        memories = []

        # Store detected interests
        for interest in insights["interests"]:
            mem = await self.store_memory(db, MemoryCreate(user_id=user_id, type="interest", value=interest))
            memories.append(mem)

        # Store detected mood
        for mood in insights["moods"]:
            mem = await self.store_memory(db, MemoryCreate(user_id=user_id, type="mood", value=mood))
            memories.append(mem)

        return memories

memory_service = MemoryService()
