from backend.rag.pipeline import get_rag_pipeline
from backend.schemas.api_schemas import ChatRequest, ChatResponse
from backend.utils.logger import logger

class ChatService:
    def __init__(self):
        self.rag_pipeline = get_rag_pipeline()

    def process_chat(self, chat_request: ChatRequest) -> ChatResponse:
        logger.info(f"Processing student query: '{chat_request.question}'")
        result = self.rag_pipeline.answer_question(question=chat_request.question)
        return ChatResponse(
            question=result["question"],
            answer=result["answer"],
            sources=result["sources"]
        )

_chat_service_instance = None

def get_chat_service() -> ChatService:
    global _chat_service_instance
    if _chat_service_instance is None:
        _chat_service_instance = ChatService()
    return _chat_service_instance
