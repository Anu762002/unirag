from fastapi import APIRouter, Depends, HTTPException
from backend.schemas.api_schemas import ChatRequest, ChatResponse
from backend.services.chat_service import get_chat_service, ChatService
from backend.auth.deps import get_current_user
from backend.db.mongodb import db_manager

router = APIRouter(tags=["Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
    current_user: dict = Depends(get_current_user)
):
    """
    Accepts student question, searches ChromaDB for top-3 relevant context chunks, and queries Gemini.
    Requires an authenticated user (Student or Admin). Saves chat interaction in user history.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    response = chat_service.process_chat(request)

    # Persist session chat in MongoDB under current user ID
    user_id = str(current_user.get("_id", current_user.get("email")))
    await db_manager.save_chat_message(
        user_id=user_id,
        question=request.question,
        answer=response.answer,
        sources=[s.dict() for s in response.sources]
    )

    return response
