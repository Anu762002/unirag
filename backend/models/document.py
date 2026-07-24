import json
import os
from typing import List, Dict, Optional
from datetime import datetime
from backend.config.settings import settings
from backend.utils.logger import logger

class DocumentStore:
    def __init__(self, metadata_file=None):
        self.metadata_file = metadata_file or settings.METADATA_FILE
        self._ensure_metadata_file()

    def _ensure_metadata_file(self):
        if not os.path.exists(self.metadata_file):
            with open(self.metadata_file, "w", encoding="utf-8") as f:
                json.dump([], f)

    def get_all(self) -> List[Dict]:
        try:
            with open(self.metadata_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to read metadata file: {e}")
            return []

    def save(self, doc_data: Dict) -> None:
        docs = self.get_all()
        # Remove existing if doc_id already exists
        docs = [d for d in docs if d["doc_id"] != doc_data["doc_id"]]
        docs.append(doc_data)
        with open(self.metadata_file, "w", encoding="utf-8") as f:
            json.dump(docs, f, indent=2)

    def delete(self, doc_id: str) -> Optional[Dict]:
        docs = self.get_all()
        target = next((d for d in docs if d["doc_id"] == doc_id), None)
        if target:
            docs = [d for d in docs if d["doc_id"] != doc_id]
            with open(self.metadata_file, "w", encoding="utf-8") as f:
                json.dump(docs, f, indent=2)
        return target

_doc_store_instance = None

def get_document_store() -> DocumentStore:
    global _doc_store_instance
    if _doc_store_instance is None:
        _doc_store_instance = DocumentStore()
    return _doc_store_instance
