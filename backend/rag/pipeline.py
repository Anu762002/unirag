import os
from typing import Dict, Any, List
from backend.config.settings import settings, BASE_DIR
from backend.rag.embeddings import get_embedding_model
from backend.vector_store.chroma_manager import get_vector_store
from backend.rag.prompts import SYSTEM_PROMPT
from backend.schemas.api_schemas import SourceCitation
from backend.utils.logger import logger

class RAGPipeline:
    def __init__(self):
        self.embedding_model = get_embedding_model()
        self.vector_store = get_vector_store()

    def _get_llm_response(self, prompt: str) -> str:
        from dotenv import load_dotenv
        env_path = BASE_DIR / ".env"
        load_dotenv(dotenv_path=env_path, override=True)
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            return (
                "⚠️ **Gemini API Key missing.**\n\n"
                "Please configure your `GEMINI_API_KEY` in `backend/.env` file to enable AI answers."
            )

        candidate_models = [
            settings.GEMINI_MODEL,
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash-latest",
        ]

        last_error = None
        for model_name in candidate_models:
            if not model_name:
                continue
            try:
                # 1. Try google.genai Client (Official Google SDK)
                try:
                    from google import genai
                    client = genai.Client(api_key=api_key)
                    res = client.models.generate_content(model=model_name, contents=prompt)
                    if res and res.text:
                        return res.text
                except Exception as ex_genai:
                    logger.debug(f"google.genai SDK with model {model_name} failed: {ex_genai}")

                # 2. Try LangChain Google GenAI
                try:
                    from langchain_google_genai import ChatGoogleGenerativeAI
                    llm = ChatGoogleGenerativeAI(
                        model=model_name,
                        google_api_key=api_key,
                        temperature=0.1
                    )
                    response = llm.invoke(prompt)
                    if response and response.content:
                        return response.content
                except Exception as ex_lc:
                    logger.debug(f"LangChain LLM model {model_name} failed: {ex_lc}")

                # 3. Fallback to google.generativeai
                import google.generativeai as genai_legacy
                genai_legacy.configure(api_key=api_key)
                model = genai_legacy.GenerativeModel(model_name)
                res = model.generate_content(prompt)
                if res and res.text:
                    return res.text
            except Exception as e:
                logger.warning(f"Gemini model '{model_name}' attempt error: {e}")
                last_error = e

        return f"An error occurred while generating answer with Gemini API: {str(last_error)}"

    def answer_question(self, question: str, top_k: int = None) -> Dict[str, Any]:
        k = top_k or settings.TOP_K

        # 1. Embed query
        query_embedding = self.embedding_model.embed_query(question)

        # 2. Vector search ChromaDB
        retrieved_items = self.vector_store.query(query_embedding=query_embedding, top_k=k)

        if not retrieved_items:
            return {
                "question": question,
                "answer": "Information not found in the uploaded university documents. (No documents uploaded or indexed yet)",
                "sources": []
            }

        # 3. Format Context Passages & Citations
        context_parts = []
        sources: List[SourceCitation] = []

        for idx, item in enumerate(retrieved_items):
            meta = item["metadata"]
            doc_name = meta.get("filename", "Unknown Document")
            page_num = meta.get("page_number", 1)
            section = meta.get("section", "General")
            chunk_id = meta.get("chunk_id", f"chunk_{idx}")
            text_snippet = item["text"]

            context_parts.append(
                f"[Document: {doc_name} | Page: {page_num} | Section: {section}]\n{text_snippet}"
            )

            sources.append(
                SourceCitation(
                    filename=doc_name,
                    page_number=page_num,
                    section=section,
                    excerpt=text_snippet,
                    chunk_id=chunk_id
                )
            )

        formatted_context = "\n\n".join(context_parts)
        prompt = SYSTEM_PROMPT.format(context=formatted_context, question=question)

        # 4. LLM Generation
        answer = self._get_llm_response(prompt)

        return {
            "question": question,
            "answer": answer,
            "sources": sources
        }

# Singleton instance
_rag_pipeline_instance = None

def get_rag_pipeline() -> RAGPipeline:
    global _rag_pipeline_instance
    if _rag_pipeline_instance is None:
        _rag_pipeline_instance = RAGPipeline()
    return _rag_pipeline_instance
