import uuid
import os
from pathlib import Path
from datetime import datetime
from typing import List, Optional
from fastapi import UploadFile, HTTPException

from backend.config.settings import settings
from backend.document_processing.pdf_loader import PDFLoader
from backend.document_processing.chunker import HierarchicalChunker
from backend.rag.embeddings import get_embedding_model
from backend.vector_store.chroma_manager import get_vector_store
from backend.models.document import get_document_store
from backend.schemas.api_schemas import DocumentMetadataSchema
from backend.utils.logger import logger

class DocumentService:
    def __init__(self):
        self.doc_store = get_document_store()
        self.vector_store = get_vector_store()
        self.embedding_model = get_embedding_model()
        self.chunker = HierarchicalChunker()

    async def upload_document(self, file: UploadFile) -> DocumentMetadataSchema:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")

        doc_id = f"doc_{uuid.uuid4().hex[:8]}"
        saved_filename = f"{doc_id}_{file.filename}"
        saved_path = settings.STORAGE_DIR / saved_filename

        # Save to disk
        file_bytes = await file.read()
        with open(saved_path, "wb") as f:
            f.write(file_bytes)

        file_size = len(file_bytes)
        logger.info(f"Saved uploaded PDF to {saved_path} ({file_size} bytes)")

        try:
            # 1. Load pages
            pages = PDFLoader.load_pdf(saved_path)
            if not pages:
                raise HTTPException(status_code=400, detail="Could not extract text from PDF or file is empty.")

            # 2. Chunk document
            chunks = self.chunker.chunk_document(doc_id=doc_id, filename=file.filename, pages=pages)
            logger.info(f"Extracted {len(chunks)} chunks from {file.filename}")

            # 3. Generate Embeddings
            chunk_texts = [c.text for c in chunks]
            embeddings = self.embedding_model.embed_documents(chunk_texts)

            # 4. Store in ChromaDB
            self.vector_store.add_chunks(chunks=chunks, embeddings=embeddings)

            # 5. Save metadata locally
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            doc_meta = {
                "doc_id": doc_id,
                "filename": file.filename,
                "saved_filename": saved_filename,
                "file_path": str(saved_path),
                "file_size": file_size,
                "page_count": len(pages),
                "chunk_count": len(chunks),
                "upload_date": now_str
            }
            self.doc_store.save(doc_meta)

            return DocumentMetadataSchema(**doc_meta)

        except Exception as e:
            # Cleanup saved file on processing failure
            if saved_path.exists():
                os.remove(saved_path)
            logger.error(f"Failed to process uploaded PDF {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

    def get_all_documents(self) -> List[DocumentMetadataSchema]:
        docs = self.doc_store.get_all()
        return [DocumentMetadataSchema(**d) for d in docs]

    def delete_document(self, doc_id: str) -> bool:
        doc = self.doc_store.delete(doc_id)
        if not doc:
            return False

        # 1. Delete file from storage
        file_path = Path(doc.get("file_path", ""))
        if file_path.exists():
            try:
                os.remove(file_path)
            except Exception as e:
                logger.warning(f"Could not remove PDF file from disk: {e}")

        # 2. Delete vectors from ChromaDB
        self.vector_store.delete_document_chunks(doc_id)
        logger.info(f"Successfully deleted document {doc_id} ({doc.get('filename')})")
        return True

_document_service_instance = None

def get_document_service() -> DocumentService:
    global _document_service_instance
    if _document_service_instance is None:
        _document_service_instance = DocumentService()
    return _document_service_instance
