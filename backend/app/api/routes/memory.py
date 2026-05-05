import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.memory import Memory, MemoryCreate, MemorySearchResponse
from app.services.memory_service import memory_service

router = APIRouter(prefix="/memory", tags=["memory"])

@router.post("/store", response_model=Memory, status_code=status.HTTP_201_CREATED)
async def store_memory(memory_in: MemoryCreate, db: AsyncSession = Depends(get_db)):
    """
    Store a new memory for a specific user.
    """
    try:
        return await memory_service.store_memory(db, memory_in)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store memory: {str(e)}"
        )

@router.get("/{user_id}", response_model=List[Memory])
async def get_memories(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Retrieve all memories for a given user.
    """
    memories = await memory_service.get_user_memories(db, user_id)
    if not memories:
        # Returning empty list is better than 404 if user exists but has no memories
        return []
    return memories

@router.get("/search", response_model=MemorySearchResponse)
async def search_memories(
    query: str = Query(..., min_length=1),
    user_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Search memories by type or value. Optionally filter by user_id.
    """
    results = await memory_service.search_memories(db, query, user_id)
    return MemorySearchResponse(
        query=query,
        results=results,
        count=len(results)
    )
