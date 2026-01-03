import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.app.core.logging import logger

class RiskSignal(BaseModel):
    source: str  # "video", "audio", "motion"
    type: str
    confidence: float
    timestamp: float
    metadata: Dict[str, Any] = {}

class FusionEngine:
    """
    AI Risk Fusion Engine for SafeNet AI.
    Merges multi-modal signals to reduce false positives and assign urgency.
    """
    def __init__(self):
        self.incident_history = []
        self.cooldown_period = 30.0  # seconds
        self.last_alert_time = 0.0

    async def evaluate_risk(self, signals: List[RiskSignal]) -> Dict[str, Any]:
        """
        Evaluate and fuse multiple risk signals.
        """
        now = time.time()
        
        # 1. Multi-signal requirement
        sources = {s.source for s in signals}
        is_multi_modal = len(sources) >= 2
        
        # 2. Confidence weighted fusion
        total_weight = sum(s.confidence for s in signals)
        avg_confidence = total_weight / len(signals) if signals else 0
        
        # 3. Urgency determination
        urgency = "LOW"
        if is_multi_modal and avg_confidence > 0.8:
            urgency = "CRITICAL"
        elif is_multi_modal or avg_confidence > 0.7:
            urgency = "HIGH"
        elif avg_confidence > 0.5:
            urgency = "MEDIUM"

        # 4. Decision logic (REAL vs IGNORE)
        # Rule: No single signal can trigger emergency alone (unless extremely high confidence mock override)
        is_real = is_multi_modal and avg_confidence > 0.6
        
        # 5. Cooldown logic
        if is_real and (now - self.last_alert_time < self.cooldown_period):
            logger.info("Risk evaluation suppressed by cooldown logic")
            is_real = False
            urgency = "LOW"

        if is_real:
            self.last_alert_time = now

        result = {
            "threat_type": "FUSED_INCIDENT" if is_real else "UNVERIFIED",
            "confidence": avg_confidence,
            "urgency": urgency,
            "status": "REAL" if is_real else "IGNORE",
            "signals_fused": len(signals),
            "timestamp": now
        }

        logger.info("Risk evaluation complete", extra={"result": result})
        return result

risk_fusion_engine = FusionEngine()
