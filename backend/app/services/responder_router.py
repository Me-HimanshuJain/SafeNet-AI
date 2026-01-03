import asyncio
import time
import math
from typing import List, Dict, Any, Optional
from backend.app.core.logging import logger

class ResponderRouter:
    """
    Emergency Responder Orchestration for SafeNet AI.
    Handles responder assignment, routing, and escalation.
    """
    def __init__(self):
        # Mock responder database
        self.responders = [
            {"id": "GUARD_01", "name": "Officer Smith", "lat": 37.7749, "lon": -122.4194, "status": "AVAILABLE", "zone": "NORTH_QUAD"},
            {"id": "GUARD_02", "name": "Officer Doe", "lat": 37.7752, "lon": -122.4189, "status": "AVAILABLE", "zone": "SOUTH_DORM"},
            {"id": "GUARD_03", "name": "Officer Johnson", "lat": 37.7745, "lon": -122.4200, "status": "BUSY", "zone": "LIBRARY"},
        ]
        self.active_incidents = {}

    def _calculate_distance(self, lat1, lon1, lat2, lon2):
        """Haversine formula for distance calculation."""
        R = 6371  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    async def assign_responder(self, incident_id: str, location: Dict[str, float]) -> Dict[str, Any]:
        """
        Orchestrates responder assignment based on proximity and zone awareness.
        """
        logger.info(f"Orchestrating response for incident {incident_id}")
        
        available = [r for r in self.responders if r["status"] == "AVAILABLE"]
        if not available:
            logger.warning("No responders available. Escalating to external emergency services.")
            return {"status": "ESCALATED", "incident_id": incident_id, "message": "External backup requested"}

        # Proximity-based selection
        nearest = min(available, key=lambda r: self._calculate_distance(r["lat"], r["lon"], location["lat"], location["lon"]))
        
        # Simulated routing
        route_estimate = {
            "distance_km": round(self._calculate_distance(nearest["lat"], nearest["lon"], location["lat"], location["lon"]), 3),
            "eta_seconds": 120,  # Mock ETA
            "steps": ["Exit security post", "Proceed to Main Quad", "Arrive at Zone"]
        }

        self.active_incidents[incident_id] = {
            "responder_id": nearest["id"],
            "assigned_at": time.time(),
            "status": "DISPATCHED"
        }

        logger.info(f"Responder {nearest['id']} dispatched to {incident_id}")
        return {
            "status": "DISPATCHED",
            "responder": nearest,
            "route": route_estimate,
            "incident_id": incident_id
        }

    async def handle_escalation(self, incident_id: str, timeout_seconds: int = 30):
        """Asynchronously monitors for responder acknowledgement and escalates if needed."""
        await asyncio.sleep(timeout_seconds)
        incident = self.active_incidents.get(incident_id)
        if incident and incident["status"] == "DISPATCHED":
            logger.error(f"Incident {incident_id} timeout. Escalating to Supervisor.")
            incident["status"] = "ESCALATED"
            return True
        return False

responder_router = ResponderRouter()
