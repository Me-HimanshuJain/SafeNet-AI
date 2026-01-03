import time
import asyncio
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form
import cv2
import numpy as np
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.services.vision_analyzer import vision_analyzer
from backend.app.services.speech_analyzer import speech_analyzer
from backend.app.services.fusion_engine import risk_fusion_engine, RiskSignal
from backend.app.services.responder_router import responder_router
from fastapi import WebSocket, WebSocketDisconnect

app = FastAPI(title=settings.PROJECT_NAME)

# In-memory store for active alerts connections
active_connections: List[WebSocket] = []

@app.websocket("/alerts/live")
async def websocket_alerts(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Keep connection alive or wait for incoming messages if needed
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

@app.post("/respond")
async def trigger_response(
    incident_id: str,
    location: Dict[str, float]
):
    """
    Endpoint for automated emergency response orchestration.
    """
    response = await responder_router.assign_responder(incident_id, location)
    
    # Broadcast to live alerts
    for connection in active_connections:
        await connection.send_json(response)

    # Start escalation monitor in background
    asyncio.create_task(responder_router.handle_escalation(incident_id))
    
    return response

@app.post("/risk/evaluate")
async def evaluate_risk(
    signals: List[RiskSignal]
):
    """
    Endpoint for AI Risk Fusion Engine evaluation.
    Merges video, audio, and motion signals.
    """
    logger.info("Received risk evaluation request")
    return await risk_fusion_engine.evaluate_risk(signals)

@app.post("/analyze/audio")
async def analyze_audio(
    file: UploadFile = File(...)
):
    """
    Endpoint for audio emergency detection.
    Accepts an audio file.
    """
    logger.info("Received audio analysis request")
    
    contents = await file.read()
    # In a real scenario, we would handle different audio formats
    analysis_results = await speech_analyzer.analyze_audio(contents)
    return analysis_results

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