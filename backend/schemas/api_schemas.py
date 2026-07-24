from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

# Document & Chat Schemas
class DocumentMetadataSchema(BaseModel):
    doc_id: str
    filename: str
    file_size: int
    page_count: int
    chunk_count: int
    upload_date: str

class DocumentUploadResponse(BaseModel):
    message: str
    documents: List[DocumentMetadataSchema]

class DocumentListResponse(BaseModel):
    total: int
    documents: List[DocumentMetadataSchema]

class DocumentDeleteResponse(BaseModel):
    message: str
    doc_id: str

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, description="Student's query about university rules/policies")

class SourceCitation(BaseModel):
    filename: str
    page_number: int
    section: Optional[str] = "General"
    excerpt: str
    chunk_id: str

class ChatResponse(BaseModel):
    question: str
    answer: str
    sources: List[SourceCitation]

# User & Auth Schemas
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = Field("student", description="Role: 'student' or 'admin'")

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
