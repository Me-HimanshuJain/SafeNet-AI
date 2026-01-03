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
from backend.app.services.silent_sos import silent_sos_manager, SOSRequest
from backend.app.services.alert_manager import alert_manager
from fastapi import WebSocket, WebSocketDisconnect

app = FastAPI(title=settings.PROJECT_NAME)

@app.websocket("/alerts/live")
async def websocket_alerts(websocket: WebSocket, topics: str = "all", zones: str = "all"):
    await websocket.accept()
    
    # Process subscription parameters
    topic_list = topics.split(",") if topics != "all" else ["emergency", "system"]
    zone_list = zones.split(",") if zones != "all" else []
    
    await alert_manager.subscribe(websocket, topic_list, zone_list)
    
    try:
        while True:
            # Handle client heartbeat or upstream messages
            data = await websocket.receive_text()
            # Echo for simulation/testing
            await websocket.send_text(f"ACK: {data}")
    except WebSocketDisconnect:
        await alert_manager.unsubscribe(websocket)

@app.post("/respond")
async def trigger_response(
    incident_id: str,
    location: Dict[str, float],
    zone_id: str = "default-zone"
):
    """
    Endpoint for automated emergency response orchestration.
    """
    response = await responder_router.assign_responder(incident_id, location)
    
    # Broadcast to live alerts using AlertManager
    await alert_manager.broadcast(
        alert_data={"type": "DISPATCH", "data": response},
        topic="emergency",
        zone=zone_id
    )

    # Start escalation monitor in background
    asyncio.create_task(responder_router.handle_escalation(incident_id))
    
    return response

@app.post("/sos/silent")
async def silent_sos(request: SOSRequest):
    """
    Endpoint for Silent SOS system.
    Supports voice, shake, gesture, and wearable triggers.
    """
    logger.info(f"Received Silent SOS request from user {request.user_id}")
    result = await silent_sos_manager.trigger_silent_sos(request)
    
    if result["status"] == "ACTIVATED":
        # Orchestrate immediate response
        incident_id = result["incident_id"]
        response_task = await responder_router.assign_responder(incident_id, request.location)
        
        # Broadcast via AlertManager
        await alert_manager.broadcast(
            alert_data={
                "type": "SILENT_SOS",
                "incident_id": incident_id,
                "user_id": request.user_id,
                "location": request.location,
                "response": response_task
            },
            topic="emergency",
            zone=request.metadata.get("zone", "default") if hasattr(request, 'metadata') and request.metadata else "default"
        )
            
        # Background escalation monitor
        asyncio.create_task(responder_router.handle_escalation(incident_id))
        
    return result

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