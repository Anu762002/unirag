import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.document_processing.pdf_loader import PDFLoader
from backend.document_processing.chunker import HierarchicalChunker
from backend.config.settings import settings
from backend.schemas.api_schemas import ChatRequest, SourceCitation, ChatResponse

def test_pipeline():
    sample_pdf = Path(__file__).parent.parent / "sample_documents" / "Academic_Regulations_2026.pdf"
    print(f"Testing PDF loading from: {sample_pdf}")
    pages = PDFLoader.load_pdf(sample_pdf)
    print(f"Loaded {len(pages)} page(s). First page length: {len(pages[0].text)} chars.")

    chunker = HierarchicalChunker()
    chunks = chunker.chunk_document(doc_id="test_doc_123", filename="Academic_Regulations_2026.pdf", pages=pages)
    print(f"Chunked into {len(chunks)} chunk(s).")
    
    first_chunk = chunks[0]
    print(f"First Chunk ID: {first_chunk.chunk_id}")
    print(f"Section: {first_chunk.section}")
    print(f"Page Number: {first_chunk.page_number}")
    print(f"Text Snippet: {first_chunk.text[:120]}...")
    print("Backend test completed successfully!")

if __name__ == "__main__":
    test_pipeline()
