from typing import Annotated, Any, List, Dict, Optional
from datetime import datetime, timezone

def get_now() -> datetime:
    """Get current UTC time."""
    return datetime.now(timezone.utc)

def format_response(data: Any, message: str = "Success") -> Dict[str, Any]:
    """Format a standard API response."""
    return {
        "status": "success",
        "message": message,
        "data": data,
        "timestamp": get_now().isoformat()
    }
