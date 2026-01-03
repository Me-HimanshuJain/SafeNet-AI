from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
from backend.app.core.logging import logger

class AnalyticsEngine:
    """
    BigQuery-style analytics engine for post-incident intelligence.
    Simulates SQL-based analysis for risk scoring and pattern detection.
    """
    def __init__(self):
        # In a real app, this would be a persistent DB (SQLite/Postgres)
        self.incidents: List[Dict[str, Any]] = []

    def record_incident(self, incident_data: Dict[str, Any]):
        """Store an incident for future analysis."""
        incident_data["timestamp"] = datetime.now()
        self.incidents.append(incident_data)

    async def get_summary(self) -> Dict[str, Any]:
        """Generate auto-generated incident report and zone-based scoring."""
        now = datetime.now()
        last_24h = now - timedelta(hours=24)
        
        recent_incidents = [i for i in self.incidents if i.get("timestamp", now) > last_24h]
        
        # Calculate zone-based risk scores
        zones = {}
        for i in self.incidents:
            z = i.get("zone", "unknown")
            zones[z] = zones.get(z, 0) + 1
            
        risk_scoring = {z: min(100, count * 20) for z, count in zones.items()}
        
        top_zone = "none"
        if zones:
            top_zone = max(zones, key=lambda k: zones[k])
        
        return {
            "total_incidents": len(self.incidents),
            "recent_24h": len(recent_incidents),
            "zone_risk_scores": risk_scoring,
            "top_risk_zone": top_zone,
            "report_summary": f"System has monitored {len(self.incidents)} incidents. "
                             f"Current high-risk areas identified in {top_zone}."
        }

    async def get_predictions(self) -> Dict[str, Any]:
        """Time-based risk prediction and pattern detection."""
        # Mock pattern detection logic
        current_hour = datetime.now().hour
        predicted_risk = "Low"
        
        if 22 <= current_hour or current_hour <= 4:
            predicted_risk = "High (Night-time patterns)"
        elif 8 <= current_hour <= 10:
            predicted_risk = "Medium (Morning traffic)"
            
        return {
            "predicted_risk_level": predicted_risk,
            "next_hour_forecast": random.randint(10, 80),
            "patterns_detected": [
                "Night-time loitering tendency in Zone A",
                "Frequent SOS triggers near Library after 8PM"
            ],
            "recommendation": "Increase patrol frequency in Zone A during 22:00-04:00"
        }

analytics_engine = AnalyticsEngine()
