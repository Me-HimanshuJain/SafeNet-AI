from typing import List, Dict, Set, Optional
from fastapi import WebSocket
from backend.app.core.logging import logger
import json

class AlertManager:
    """
    Firebase-style real-time alert delivery manager.
    Supports topic-based and area-specific broadcasting.
    """
    def __init__(self):
        # topic -> set of websockets
        self.subscriptions: Dict[str, Set[WebSocket]] = {}
        # zone -> set of websockets
        self.zone_subscriptions: Dict[str, Set[WebSocket]] = {}

    async def subscribe(self, websocket: WebSocket, topics: Optional[List[str]] = None, zones: Optional[List[str]] = None):
        """Subscribe a connection to specific topics or zones."""
        if topics:
            for topic in topics:
                if topic not in self.subscriptions:
                    self.subscriptions[topic] = set()
                self.subscriptions[topic].add(websocket)
        
        if zones:
            for zone in zones:
                if zone not in self.zone_subscriptions:
                    self.zone_subscriptions[zone] = set()
                self.zone_subscriptions[zone].add(websocket)

    async def unsubscribe(self, websocket: WebSocket):
        """Clean up all subscriptions for a disconnected websocket."""
        # Create a copy of keys to avoid modification during iteration
        for topic in list(self.subscriptions.keys()):
            self.subscriptions[topic].discard(websocket)
            if not self.subscriptions[topic]:
                del self.subscriptions[topic]
                
        for zone in list(self.zone_subscriptions.keys()):
            self.zone_subscriptions[zone].discard(websocket)
            if not self.zone_subscriptions[zone]:
                del self.zone_subscriptions[zone]

    async def broadcast(self, alert_data: Dict, topic: Optional[str] = None, zone: Optional[str] = None):
        """Broadcast alert to relevant subscribers."""
        targets: Set[WebSocket] = set()
        
        if topic and topic in self.subscriptions:
            targets.update(self.subscriptions[topic])
        
        if zone and zone in self.zone_subscriptions:
            targets.update(self.zone_subscriptions[zone])
            
        # Default broadcast if no topic/zone specified
        if not topic and not zone:
            for subs in self.subscriptions.values():
                targets.update(subs)

        if not targets:
            logger.info(f"No subscribers for alert: {alert_data.get('type')}")
            return

        message = json.dumps(alert_data)
        disconnected = []
        
        for ws in targets:
            try:
                await ws.send_text(message)
            except Exception:
                disconnected.append(ws)
                
        # Clean up failed connections
        for ws in disconnected:
            await self.unsubscribe(ws)

alert_manager = AlertManager()
