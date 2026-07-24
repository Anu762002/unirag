import os
from pathlib import Path
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "University Academic Assistant"
    API_V1_STR: str = "/api"
    
    # Gemini Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-flash-latest"
    
    # RAG Settings
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-small-en-v1.5"
    TOP_K: int = 3
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    
    # Paths
    STORAGE_DIR: Path = BASE_DIR / "storage" / "uploads"
    CHROMA_DIR: Path = BASE_DIR / "storage" / "chroma_db"
    METADATA_FILE: Path = BASE_DIR / "storage" / "metadata.json"
    
    # MongoDB & Auth Configuration
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "university_assistant"
    JWT_SECRET: str = "academic_assistant_secret_key_jwt_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Collection Name
    CHROMA_COLLECTION_NAME: str = "university_docs"
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

# Ensure storage directories exist
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
os.makedirs(settings.CHROMA_DIR, exist_ok=True)
