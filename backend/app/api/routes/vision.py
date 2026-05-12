from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.vision_service import vision_service

router = APIRouter(prefix="/vision", tags=["vision"])

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Endpoint to upload an image and receive object detection results.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File uploaded is not an image."
        )
    
    try:
        content = await file.read()
        results = await vision_service.analyze_image(content)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image analysis failed: {str(e)}"
        )
