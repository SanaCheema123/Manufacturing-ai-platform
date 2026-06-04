from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/manufacturing_ai")
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017/manufacturing_ai")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # App
    APP_NAME: str = "AI Manufacturing Quality Inspection Platform"
    DEVELOPER: str = "Sana Cheema"
    COMPANY: str = "AIVONEX"
    
    # CrewAI
    GROQ_MODEL: str = "llama3-70b-8192"
    
    class Config:
        env_file = ".env"

settings = Settings()
