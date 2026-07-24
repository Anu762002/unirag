from pathlib import Path
from typing import List, Dict, Any
import pypdf
from backend.utils.logger import logger

class PageContent:
    def __init__(self, page_number: int, text: str):
        self.page_number = page_number
        self.text = text

class PDFLoader:
    @staticmethod
    def load_pdf(file_path: Path) -> List[PageContent]:
        """
        Extracts text from a PDF file while preserving 1-indexed page numbers.
        """
        pages: List[PageContent] = []
        try:
            reader = pypdf.PdfReader(str(file_path))
            for i, page in enumerate(reader.pages):
                extracted = page.extract_text() or ""
                pages.append(PageContent(page_number=i + 1, text=extracted))
            logger.info(f"Successfully loaded {len(pages)} pages from {file_path.name}")
        except Exception as e:
            logger.error(f"Failed to load PDF {file_path}: {e}")
            raise e
        return pages
