import os
from typing import List
from sentence_transformers import SentenceTransformer
from langchain_core.embeddings import Embeddings
from backend.config.settings import settings
from backend.utils.logger import logger

class BAAIEmbeddings(Embeddings):
    """
    Embedding manager utilizing HuggingFace BAAI/bge-small-en-v1.5 model.
    """
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.EMBEDDING_MODEL_NAME
        logger.info(f"Loading embedding model: {self.model_name}")
        try:
            # Prefer cached local model files if present
            self.model = SentenceTransformer(self.model_name, local_files_only=True)
            logger.info(f"Successfully loaded cached embedding model '{self.model_name}' locally.")
        except Exception:
            try:
                self.model = SentenceTransformer(self.model_name)
                logger.info(f"Successfully fetched embedding model '{self.model_name}' from HuggingFace.")
            except Exception as e:
                logger.error(f"Failed to load embedding model '{self.model_name}': {e}")
                raise e

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        embeddings = self.model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
        return embeddings.tolist()

    def embed_query(self, text: str) -> List[float]:
        embedding = self.model.encode(text, show_progress_bar=False, normalize_embeddings=True)
        return embedding.tolist()

# Global embedding instance singleton
_embedding_instance = None

def get_embedding_model() -> BAAIEmbeddings:
    global _embedding_instance
    if _embedding_instance is None:
        _embedding_instance = BAAIEmbeddings()
    return _embedding_instance
