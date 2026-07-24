import os
import asyncio
from pathlib import Path
from fastapi import UploadFile
from backend.services.document_service import get_document_service

async def init_samples():
    doc_service = get_document_service()
    sample_dir = Path(__file__).resolve().parent.parent / "sample_documents"
    
    sample_files = [
        "Academic_Regulations_2026.pdf",
        "Hostel_Rules_and_Policies.pdf",
        "Examination_Guidelines.pdf"
    ]

    print("Indexing sample university PDF documents into ChromaDB...")
    for filename in sample_files:
        file_path = sample_dir / filename
        if not file_path.exists():
            print(f"Skipping {filename} (not found)")
            continue

        with open(file_path, "rb") as f:
            upload_file = UploadFile(filename=filename, file=f)
            meta = await doc_service.upload_document(upload_file)
            print(f"Indexed '{filename}': {meta.page_count} pages, {meta.chunk_count} chunks")

    print("Sample document indexing complete!")

if __name__ == "__main__":
    asyncio.run(init_samples())
