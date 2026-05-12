from typing import Annotated, Any, List, Dict, Optional
from app.models.memory import Memory

class ContextService:
    def correlate_vision_with_memory(self, detected_objects: List[str], memories: List[Memory]) -> Optional[str]:
        """
        Correlates detected objects from an image with a user's memory list.
        Returns a context-aware response if a match is found.
        """
        for obj in detected_objects:
            obj_lower = obj.lower()
            
            for memory in memories:
                # We assume memory.value contains the context, e.g., "ramen" or "wants to try ramen"
                memory_value_lower = memory.value.lower()
                
                # Simple NLP matching (substring or word boundary)
                if obj_lower in memory_value_lower or memory_value_lower in obj_lower:
                    # Construct a contextual response
                    return f"Didn't you want to try {obj_lower}?"
                    
        return None

context_service = ContextService()
