import cv2
import numpy as np
import time
from typing import List, Dict, Any, Optional
from backend.app.core.logging import logger

try:
    import mediapipe as mp
    from mediapipe.python.solutions import pose as mp_pose
    HAS_MEDIAPIPE = True
except (ImportError, AttributeError):
    HAS_MEDIAPIPE = False
    logger.warning("MediaPipe not fully available, falling back to mock vision analysis")

class VisionAnalyzer:
    """
    Video Intelligence analyzer mimicking Google Vision AI signatures.
    Focused on posture and behavior analysis without biometric tracking.
    """
    def __init__(self):
        if HAS_MEDIAPIPE:
            self.pose = mp_pose.Pose(
                static_image_mode=False,
                model_complexity=1,
                enable_segmentation=False,
                min_detection_confidence=0.5
            )
        else:
            self.pose = None

    async def analyze_frame(
        self, 
        frame: np.ndarray, 
        zone_id: str, 
        timestamp: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Analyzes a single video frame for safety incidents.
        """
        if timestamp is None:
            timestamp = time.time()

        detected_events = []

        if HAS_MEDIAPIPE and self.pose and frame is not None:
            try:
                # Convert to RGB for MediaPipe
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = self.pose.process(rgb_frame)
                
                if results.pose_landmarks:
                    # Fall Detection Heuristic: Head lower than hips + horizontal orientation
                    landmarks = results.pose_landmarks.landmark
                    nose = landmarks[mp_pose.PoseLandmark.NOSE]
                    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
                    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
                    
                    avg_hip_y = (left_hip.y + right_hip.y) / 2
                    
                    if nose.y > avg_hip_y:
                        detected_events.append({
                            "type": "MEDICAL_EMERGENCY_FALL",
                            "confidence": 0.85,
                            "description": "Potential fall detected via posture analysis"
                        })
            except Exception as e:
                logger.error(f"Error during MediaPipe analysis: {e}")

        # Example loitering check based on timestamp (night-time)
        hour = time.localtime(timestamp).tm_hour
        if (hour >= 22 or hour <= 5):
            detected_events.append({
                "type": "SUSPICIOUS_LOITERING",
                "confidence": 0.70,
                "description": "Night-time activity detected in secure zone"
            })

        return {
            "annotationResults": [{
                "inputUri": f"zone://{zone_id}",
                "segment": {
                    "startTimeOffset": f"{timestamp}s",
                    "endTimeOffset": f"{timestamp}s"
                },
                "detectedEvents": detected_events,
                "timestamp": timestamp,
                "zoneId": zone_id
            }]
        }

vision_analyzer = VisionAnalyzer()
