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
from backend.app.services.analytics_engine import analytics_engine
from backend.app.core.security import security_enforcer
from fastapi import WebSocket, WebSocketDisconnect, Depends

app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/analytics/summary")
async def get_analytics_summary(api_key: str = Depends(security_enforcer.verify_api_key)):
    """
    Endpoint for incident intelligence summary.
    """
    await security_enforcer.enforce_rbac(api_key, "analytics")
    security_enforcer.log_audit(api_key, "READ", "analytics_summary", "SUCCESS")
    return await analytics_engine.get_summary()

@app.get("/analytics/predictions")
async def get_risk_predictions(api_key: str = Depends(security_enforcer.verify_api_key)):
    """
    Endpoint for time-based risk forecasting.
    """
    await security_enforcer.enforce_rbac(api_key, "analytics")
    security_enforcer.log_audit(api_key, "READ", "analytics_predictions", "SUCCESS")
    return await analytics_engine.get_predictions()

@app.get("/audit/logs")
async def get_audit_logs(api_key: str = Depends(security_enforcer.verify_api_key)):
    """
    Endpoint for viewing audit logs (Admin only).
    """
    await security_enforcer.enforce_rbac(api_key, "audit")
    return security_enforcer.audit_logs

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
async def silent_sos(request: SOSRequest, api_key: str = Depends(security_enforcer.verify_api_key)):
    """
    Endpoint for Silent SOS system.
    Supports voice, shake, gesture, and wearable triggers.
    """
    await security_enforcer.check_rate_limit(request.user_id)
    logger.info(f"Received Silent SOS request from user {request.user_id}")
    result = await silent_sos_manager.trigger_silent_sos(request)
    
    if result["status"] == "ACTIVATED":
        # Record for analytics
        analytics_engine.record_incident({
            "type": "SILENT_SOS",
            "user_id": request.user_id,
            "zone": request.metadata.get("zone", "default") if hasattr(request, 'metadata') and request.metadata else "default"
        })
        
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

@app.post("/simulate/{event_type}")
async def simulate_event(event_type: str, api_key: str = Depends(security_enforcer.verify_api_key)):
    """
    Live simulation endpoint for judges.
    Triggers full pipeline execution for specific emergency types.
    """
    await security_enforcer.enforce_rbac(api_key, "admin")
    
    simulation_map = {
        "fall_detection": {
            "type": "VISION",
            "event": "CRITICAL_FALL",
            "zone": "Zone-A-South",
            "priority": "HIGH"
        },
        "scream_detection": {
            "type": "AUDIO",
            "event": "DISTRESS_SCREAM",
            "zone": "Zone-B-Library",
            "priority": "CRITICAL"
        },
        "crowd_panic": {
            "type": "VISION",
            "event": "UNUSUAL_MOTION_PACK",
            "zone": "Main-Plaza",
            "priority": "HIGH"
        },
        "medical_collapse": {
            "type": "VISION",
            "event": "PROLONGED_IMMOBILITY",
            "zone": "Cafeteria-West",
            "priority": "CRITICAL"
        }
    }
    
    if event_type not in simulation_map:
        raise HTTPException(status_code=400, detail="Invalid event type")
    
    event_data = simulation_map[event_type]
    incident_id = f"sim-{int(time.time())}"
    location = {"lat": 37.7749, "lng": -122.4194}
    
    # Record in analytics
    analytics_engine.record_incident({
        "type": event_data["type"],
        "event": event_data["event"],
        "zone": event_data["zone"],
        "simulated": True
    })
    
    # Orchestrate response
    response_task = await responder_router.assign_responder(incident_id, location)
    
    # Broadcast live alert
    await alert_manager.broadcast(
        alert_data={
            "type": "SIMULATION_ALERT",
            "event_type": event_type,
            "incident_id": incident_id,
            "zone": event_data["zone"],
            "severity": event_data["priority"],
            "response": response_task
        },
        topic="emergency",
        zone=event_data["zone"]
    )
    
    security_enforcer.log_audit(api_key, "SIMULATE", event_type, "SUCCESS")
    
    return {
        "status": "SIMULATION_TRIGGERED",
        "event": event_type,
        "incident_id": incident_id,
        "broadcast": "SUCCESS"
    }

@app.on_event("startup")
async def startup_event():
    logger.info("SafeNet AI Backend starting up", extra={"config": settings.model_dump()})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)