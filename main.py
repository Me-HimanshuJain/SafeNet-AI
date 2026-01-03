import time
from fastapi import FastAPI, UploadFile, File, Form
import cv2
import numpy as np
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.services.vision_analyzer import vision_analyzer

app = FastAPI(title=settings.PROJECT_NAME)

@app.post("/analyze/video")
async def analyze_video(
    file: UploadFile = File(...),
    zone_id: str = Form("default-zone")
):
    """
    Endpoint for video intelligence analysis.
    Accepts a video file or frame.
    """
    logger.info(f"Received video analysis request for zone: {zone_id}")
    
    # Read image/frame from upload
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        return {"error": "Invalid image or video frame"}

    analysis_results = await vision_analyzer.analyze_frame(frame, zone_id)
    return analysis_results

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "project": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }

@app.on_event("startup")
async def startup_event():
    logger.info("SafeNet AI Backend starting up", extra={"config": settings.model_dump()})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)