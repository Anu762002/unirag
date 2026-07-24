import os
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse

from backend.services.document_service import get_document_service, DocumentService
from backend.models.document import get_document_store
from backend.schemas.api_schemas import (
    DocumentUploadResponse,
    DocumentListResponse,
    DocumentDeleteResponse,
    DocumentMetadataSchema
)
from backend.auth.deps import require_admin, get_optional_user
from backend.utils.logger import logger

router = APIRouter(tags=["Documents"])

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_documents(
    files: List[UploadFile] = File(...),
    doc_service: DocumentService = Depends(get_document_service),
    admin_user: dict = Depends(require_admin)
):
    """
    Upload one or multiple PDF documents. Restricted to Administrators.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided in upload request.")

    uploaded_docs: List[DocumentMetadataSchema] = []
    for file in files:
        logger.info(f"Admin {admin_user.get('email')} processing upload for file: {file.filename}")
        doc_meta = await doc_service.upload_document(file)
        uploaded_docs.append(doc_meta)

    return DocumentUploadResponse(
        message=f"Successfully uploaded and indexed {len(uploaded_docs)} document(s).",
        documents=uploaded_docs
    )

@router.get("/documents", response_model=DocumentListResponse)
def list_documents(
    doc_service: DocumentService = Depends(get_document_service),
    user: dict = Depends(get_optional_user)
):
    """
    Returns list of all cataloged university documents and their metadata.
    """
    docs = doc_service.get_all_documents()
    return DocumentListResponse(total=len(docs), documents=docs)

@router.get("/documents/view/id/{doc_id}")
def view_document_by_id(doc_id: str):
    """
    Serves PDF document inline for viewing in browser.
    """
    doc_store = get_document_store()
    all_docs = doc_store.get_all()
    target = next((d for d in all_docs if d["doc_id"] == doc_id), None)
    
    if not target or not os.path.exists(target.get("file_path", "")):
        raise HTTPException(status_code=404, detail="Document file not found on server disk.")
    
    filename = target.get("filename", "document.pdf")
    return FileResponse(
        path=target["file_path"],
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'}
    )

@router.get("/documents/view/file/{filename:path}")
def view_document_by_filename(filename: str):
    """
    Serves PDF document inline matching filename (used for chat citation badges).
    """
    doc_store = get_document_store()
    all_docs = doc_store.get_all()
    # Search for exact filename match or basename match
    clean_name = os.path.basename(filename)
    target = next((d for d in all_docs if d.get("filename") == clean_name or d.get("filename") == filename), None)
    
    if not target or not os.path.exists(target.get("file_path", "")):
        raise HTTPException(status_code=404, detail=f"Document '{filename}' not found on server disk.")
    
    return FileResponse(
        path=target["file_path"],
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{target.get("filename", "document.pdf")}"'}
    )

@router.get("/documents/download/id/{doc_id}")
def download_document_by_id(doc_id: str):
    """
    Triggers PDF document download attachment.
    """
    doc_store = get_document_store()
    all_docs = doc_store.get_all()
    target = next((d for d in all_docs if d["doc_id"] == doc_id), None)
    
    if not target or not os.path.exists(target.get("file_path", "")):
        raise HTTPException(status_code=404, detail="Document file not found on server disk.")
    
    filename = target.get("filename", "document.pdf")
    return FileResponse(
        path=target["file_path"],
        media_type="application/pdf",
        filename=filename,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.delete("/documents/{doc_id}", response_model=DocumentDeleteResponse)
def delete_document(
    doc_id: str,
    doc_service: DocumentService = Depends(get_document_service),
    admin_user: dict = Depends(require_admin)
):
    """
    Deletes a document by ID and removes its embeddings from ChromaDB. Restricted to Administrators.
    """
    logger.info(f"Admin {admin_user.get('email')} deleting document {doc_id}")
    success = doc_service.delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Document with ID '{doc_id}' not found.")

    return DocumentDeleteResponse(
        message=f"Document {doc_id} successfully deleted.",
        doc_id=doc_id
    )
