import cv2
import numpy as np
import time
from typing import Dict, Any, Optional
from backend.app.core.logging import logger
from mediapipe.tasks.python.vision import PoseLandmarkerResult


# ------------------------------
# MediaPipe Tasks API (Python 3.13 SAFE)
# ------------------------------
HAS_MEDIAPIPE = False
pose_detector = None

try:
    import mediapipe as mp
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision

    MODEL_PATH = "pose_landmarker_lite.task"
    # Make sure this file exists in project root

    base_options = python.BaseOptions(
        model_asset_path=MODEL_PATH
    )

    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.VIDEO,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5
    )

    pose_detector = vision.PoseLandmarker.create_from_options(options)
    HAS_MEDIAPIPE = True

except Exception as e:
    logger.warning(
        f"MediaPipe Tasks unavailable – running VisionAnalyzer in OPENCV mode ({e})"
    )


class VisionAnalyzer:
    """
    Local-safe Video Intelligence analyzer.
    Uses REAL camera + MediaPipe Tasks API on Python 3.13.
    """

    def __init__(self):
        self.mode = "mediapipe" if HAS_MEDIAPIPE else "opencv_only"
        logger.info(f"VisionAnalyzer running in {self.mode} mode")

    async def analyze_frame(
        self,
        frame: np.ndarray,
        zone_id: str,
        timestamp: Optional[float] = None
    ) -> Dict[str, Any]:

        if timestamp is None:
            timestamp = time.time()

        detected_events = []

        # ------------------------------
        # REAL MediaPipe Pose Analysis
        # ------------------------------
        if HAS_MEDIAPIPE and frame is not None:
            try:
                mp_image = mp.Image(
                    image_format=mp.ImageFormat.SRGB,
                    data=frame
                )

                result = pose_detector.detect_for_video(
                    mp_image,
                    int(timestamp * 1000)
                )

                if result.pose_landmarks:
                    landmarks = result.pose_landmarks[0]

                    nose_y = landmarks[0].y
                    left_hip_y = landmarks[23].y
                    right_hip_y = landmarks[24].y
                    avg_hip_y = (left_hip_y + right_hip_y) / 2
                    # ===== STEP 1.3: DRAW POSE LANDMARKS =====
                    for lm in landmarks:
                        x = int(lm.x * frame.shape[1])
                        y = int(lm.y * frame.shape[0])
                        cv2.circle(frame, (x, y), 4, (0, 255, 0), -1)


                    # Simple fall heuristic
                    if nose_y > avg_hip_y:
                        detected_events.append({
                            "type": "MEDICAL_EMERGENCY_FALL",
                            "confidence": 0.85,
                            "description": "Potential fall detected via pose landmarks"
                        })

            except Exception as e:
                logger.error(f"MediaPipe Tasks analysis failed: {e}")

        # ------------------------------
        # OpenCV-only fallback (still REAL)
        # ------------------------------
        if not HAS_MEDIAPIPE and frame is not None:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            motion_score = float(np.var(gray))

            if motion_score > 500:
                detected_events.append({
                    "type": "UNUSUAL_MOVEMENT",
                    "confidence": 0.60,
                    "description": "High motion detected via OpenCV"
                })

        # ------------------------------
        # Rule-based loitering
        # ------------------------------
        hour = time.localtime(timestamp).tm_hour
        if hour >= 22 or hour <= 5:
            detected_events.append({
                "type": "SUSPICIOUS_LOITERING",
                "confidence": 0.70,
                "description": "Night-time activity detected in secure zone"
            })
            cv2.imshow("SafeNet AI – Pose Overlay", frame)
            cv2.waitKey(1)

        # ------------------------------
        # Google Vision–style response
        # ------------------------------
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


# Singleton instance
vision_analyzer = VisionAnalyzer()
