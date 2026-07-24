import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager

# Add project root to sys.path automatically
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from backend.config.settings import settings
from backend.middleware.cors import setup_middleware
from backend.routers import documents_router, chat_router, auth_router
from backend.db.mongodb import db_manager
from backend.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing application startup services...")
    await db_manager.connect()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack AI Academic Assistant for University documents using RAG & Gemini API",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS & error handling
setup_middleware(app)

# Mount Routers
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(chat_router)

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs": "/docs",
        "mongodb_connected": db_manager.is_connected,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "mongodb": db_manager.is_connected}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8005, reload=True)
