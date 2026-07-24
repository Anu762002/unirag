import os
from typing import List
from langchain_core.embeddings import Embeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from backend.config.settings import settings
from backend.utils.logger import logger

class GeminiEmbeddings(Embeddings):
    """
    Lightweight embedding manager utilizing Google Gemini text-embedding-004 model via API.
    Does not require PyTorch or SentenceTransformers, keeping memory footprint under 100MB.
    """
    def __init__(self):
        logger.info("Initializing Google Gemini Embeddings (models/text-embedding-004)...")
        try:
            self.model = GoogleGenerativeAIEmbeddings(
                model="models/text-embedding-004",
                google_api_key=settings.GEMINI_API_KEY
            )
            logger.info("Successfully initialized Google Gemini Embeddings.")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Embeddings: {e}")
            raise e

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        return self.model.embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        return self.model.embed_query(text)

# Global embedding instance singleton
_embedding_instance = None

def get_embedding_model() -> GeminiEmbeddings:
    global _embedding_instance
    if _embedding_instance is None:
        _embedding_instance = GeminiEmbeddings()
    return _embedding_instance

