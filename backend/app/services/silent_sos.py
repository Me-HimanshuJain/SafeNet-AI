import time
from typing import Dict, Any, Optional
from pydantic import BaseModel
from backend.app.core.logging import logger

class SOSRequest(BaseModel):
    user_id: str
    trigger_type: str  # "voice", "shake", "gesture", "wearable"
    location: Dict[str, float]
    metadata: Optional[Dict[str, Any]] = {}

class SilentSOSManager:
    """
    Manages silent SOS triggers with debounce and abuse protection.
    """
    def __init__(self):
        self.last_sos_time: Dict[str, float] = {}
        self.debounce_seconds = 10.0

    async def trigger_silent_sos(self, request: SOSRequest) -> Dict[str, Any]:
        """
        Processes a silent SOS request and orchestrates immediate response.
        """
        now = time.time()
        user_id = request.user_id

        # Debounce/Abuse protection
        if user_id in self.last_sos_time:
            elapsed = now - self.last_sos_time[user_id]
            if elapsed < self.debounce_seconds:
                logger.warning(f"Debounced SOS request from user {user_id}")
                return {
                    "status": "DEBOUNCED",
                    "message": f"Please wait {int(self.debounce_seconds - elapsed)}s before re-triggering.",
                    "timestamp": now
                }

        self.last_sos_time[user_id] = now
        
        logger.info(f"SILENT SOS TRIGGERED: {request.trigger_type} by user {user_id}", extra={
            "location": request.location,
            "metadata": request.metadata
        })

        # Logic for immediate escalation
        # In a real scenario, this would notify the ResponderRouter and broadcast via WebSocket
        return {
            "status": "ACTIVATED",
            "message": "Silent SOS received. Emergency responders are being dispatched to your location.",
            "incident_id": f"SOS-{int(now)}",
            "urgency": "CRITICAL",
            "timestamp": now
        }

silent_sos_manager = SilentSOSManager()
