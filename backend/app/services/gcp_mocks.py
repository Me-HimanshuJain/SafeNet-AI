from typing import Any, List
from backend.app.core.logging import logger

class MockVertexAI:
    async def predict(self, instances: List[Any], parameters: Any = None) -> Any:
        logger.info("Mock Vertex AI prediction call", extra={"instances": instances})
        return {"predictions": ["mock_prediction"]}

class MockVisionAI:
    async def detect_labels(self, content: bytes) -> List[str]:
        logger.info("Mock Vision AI label detection")
        return ["security_camera", "campus_quad"]

class MockSpeechToText:
    async def transcribe(self, audio_content: bytes) -> str:
        logger.info("Mock Speech-to-Text transcription")
        return "This is a mock transcription of emergency audio."

vertex_ai = MockVertexAI()
vision_ai = MockVisionAI()
speech_to_text = MockSpeechToText()