from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.services.nexus_agents import swarm

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/consensus")
async def get_agent_consensus(
    trade_params: Dict[str, Any],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Trigger a multi-agent consensus audit.
    """
    return await swarm.get_consensus(trade_params)
