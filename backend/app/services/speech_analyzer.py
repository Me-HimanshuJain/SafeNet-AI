import numpy as np
import time
from typing import Dict, Any, List
from backend.app.core.logging import logger

# ------------------------------
# Safe audio import (Python 3.13)
# ------------------------------
try:
    import sounddevice as sd
    HAS_AUDIO_LIBS = True
except Exception as e:
    HAS_AUDIO_LIBS = False
    sd = None
    logger.warning(
        f"Audio processing libraries not fully available, "
        f"falling back to basic analysis ({e})"
    )


class SpeechAnalyzer:
    """
    Real-time Audio Analyzer (Python 3.13 safe)

    - Uses REAL microphone input
    - Detects high-intensity emergency sounds
    - NO unstable speech-to-text
    - Designed for fusion with VisionAnalyzer
    """

    def __init__(self):
        # Emergency keywords (used ONLY if transcript exists)
        self.emergency_keywords: List[str] = [
            "help", "fire", "emergency", "stop", "police"
        ]

        # Audio parameters (realistic)
        self.sample_rate: int = 16000
        self.capture_duration: float = 1.2  # seconds

        # Thresholds (empirically stable)
        self.normal_db: float = -35.0
        self.emergency_db: float = -18.0

        logger.info(
            "SpeechAnalyzer initialized "
            f"(audio_libs={'enabled' if HAS_AUDIO_LIBS else 'disabled'})"
        )

    # ------------------------------
    # REAL microphone capture
    # ------------------------------
    def _capture_audio(self) -> np.ndarray:
        if not HAS_AUDIO_LIBS:
            return np.array([])

        try:
            audio = sd.rec(
                int(self.capture_duration * self.sample_rate),
                samplerate=self.sample_rate,
                channels=1,
                dtype="float32"
            )
            sd.wait()
            return audio.flatten()
        except Exception as e:
            logger.error(f"Microphone capture failed: {e}")
            return np.array([])

    # ------------------------------
    # Audio analysis entry point
    # ------------------------------
    async def analyze_audio(self) -> Dict[str, Any]:
        """
        Analyzes real-time audio for emergency indicators.
        Always returns a stable response.
        """

        timestamp = time.time()
        detected_events: List[Dict[str, Any]] = []

        audio_db: float = -100.0
        transcript: str = ""  # intentionally empty on 3.13

        # ------------------------------
        # REAL audio energy detection
        # ------------------------------
        if HAS_AUDIO_LIBS:
            y = self._capture_audio()

            if len(y) > 0:
                rms = float(np.sqrt(np.mean(y ** 2)))
                audio_db = 20 * np.log10(rms) if rms > 0 else -100.0

                logger.debug(
                    f"Audio metrics | RMS={rms:.6f}, dB={audio_db:.1f}"
                )

                if audio_db >= self.emergency_db:
                    detected_events.append({
                        "type": "EMERGENCY_AUDIO_SPIKE",
                        "confidence": 0.90,
                        "description": (
                            f"High-intensity sound detected "
                            f"({audio_db:.1f} dB)"
                        )
                    })

        # ------------------------------
        # Keyword detection (optional)
        # ------------------------------
        found_keywords = [
            word for word in self.emergency_keywords
            if transcript and word in transcript.lower()
        ]

        if found_keywords:
            detected_events.append({
                "type": "DISTRESS_KEYWORDS",
                "confidence": 0.85,
                "description": (
                    f"Emergency keywords detected: "
                    f"{', '.join(found_keywords)}"
                )
            })

        # ------------------------------
        # Fusion-ready response
        # ------------------------------
        return {
            "results": [{
                "alternatives": [{
                    "transcript": transcript,
                    "confidence": 0.0 if not transcript else 0.95
                }],
                "audioMetadata": {
                    "audioDb": round(audio_db, 1),
                    "events": detected_events,
                    "isEmergency": len(detected_events) > 0,
                    "timestamp": timestamp
                }
            }]
        }


# ------------------------------
# Singleton instance
# ------------------------------
speech_analyzer = SpeechAnalyzer()
