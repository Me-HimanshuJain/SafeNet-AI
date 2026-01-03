from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SafeNet AI"
    ENVIRONMENT: str = "development"
    
    # Google Cloud Config
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    VERTEX_AI_LOCATION: str = "us-central1"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()