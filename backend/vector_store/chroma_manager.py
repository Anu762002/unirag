import chromadb
from typing import List, Dict, Any, Optional
from backend.config.settings import settings
from backend.document_processing.chunker import Chunk
from backend.utils.logger import logger

class ChromaVectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=str(settings.CHROMA_DIR))
        self.collection = self.client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        logger.info(f"Initialized ChromaDB collection '{settings.CHROMA_COLLECTION_NAME}' at {settings.CHROMA_DIR}")

    def add_chunks(self, chunks: List[Chunk], embeddings: List[List[float]]) -> None:
        if not chunks:
            return

        ids = [chunk.chunk_id for chunk in chunks]
        documents = [chunk.text for chunk in chunks]
        metadatas = [chunk.metadata for chunk in chunks]

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
        logger.info(f"Successfully added {len(chunks)} chunks to ChromaDB collection")

    def query(
        self, query_embedding: List[float], top_k: int = 3, filter_doc_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        where_filter = {"doc_id": filter_doc_id} if filter_doc_id else None

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter,
            include=["documents", "metadatas", "distances"]
        )

        retrieved = []
        if results and results.get("documents") and len(results["documents"]) > 0:
            docs = results["documents"][0]
            metas = results["metadatas"][0]
            distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)

            for doc_text, meta, dist in zip(docs, metas, distances):
                retrieved.append({
                    "text": doc_text,
                    "metadata": meta,
                    "distance": dist,
                    # Cosine distance to similarity score
                    "score": round(max(0.0, 1.0 - dist), 4)
                })

        return retrieved

    def delete_document_chunks(self, doc_id: str) -> None:
        try:
            self.collection.delete(where={"doc_id": doc_id})
            logger.info(f"Deleted chunks for document {doc_id} from ChromaDB")
        except Exception as e:
            logger.error(f"Error deleting chunks for doc_id {doc_id}: {e}")

    def get_total_chunks(self) -> int:
        return self.collection.count()

# Singleton vector store instance
_vector_store_instance = None

def get_vector_store() -> ChromaVectorStore:
    global _vector_store_instance
    if _vector_store_instance is None:
        _vector_store_instance = ChromaVectorStore()
    return _vector_store_instance
