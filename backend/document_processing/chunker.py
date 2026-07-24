import re
import uuid
from typing import List, Dict, Any
from backend.document_processing.pdf_loader import PageContent
from backend.document_processing.text_cleaner import TextCleaner
from backend.config.settings import settings

class Chunk:
    def __init__(
        self,
        chunk_id: str,
        doc_id: str,
        filename: str,
        page_number: int,
        section: str,
        text: str,
        metadata: Dict[str, Any]
    ):
        self.chunk_id = chunk_id
        self.doc_id = doc_id
        self.filename = filename
        self.page_number = page_number
        self.section = section
        self.text = text
        self.metadata = metadata

class HierarchicalChunker:
    """
    Implements Hierarchical Chunking for university documents:
    Document -> Section -> Subsection -> Paragraph Chunks
    Target size: 512 characters
    Overlap: 50 characters
    """
    def __init__(self, chunk_size: int = None, chunk_overlap: int = None):
        self.chunk_size = chunk_size or settings.CHUNK_SIZE
        self.chunk_overlap = chunk_overlap or settings.CHUNK_OVERLAP

    @staticmethod
    def _is_section_header(line: str) -> bool:
        """
        Detects if a line acts as a section header (e.g., Section 1, Chapter II, 1.1 Header, UPPERCASE TITLE).
        """
        line_clean = line.strip()
        if not line_clean or len(line_clean) > 80:
            return False
        
        # Patterns for headings
        header_patterns = [
            r'^(SECTION|ARTICLE|CHAPTER|RULE|POLICY|GUIDELINE|CLAUSE)\s+\d+[:\.]?',
            r'^\d+(\.\d+)*\s+[A-Z]',
            r'^[A-Z\s]{4,60}$'  # ALL CAPS TITLE
        ]
        
        for pattern in header_patterns:
            if re.match(pattern, line_clean, re.IGNORECASE):
                return True
        return False

    def chunk_document(
        self, doc_id: str, filename: str, pages: List[PageContent]
    ) -> List[Chunk]:
        chunks: List[Chunk] = []
        current_section = "General Regulations"
        chunk_index = 0

        for page in pages:
            cleaned_text = TextCleaner.clean_text(page.text)
            if not cleaned_text:
                continue

            lines = cleaned_text.split("\n")
            page_text_blocks = []
            
            for line in lines:
                if self._is_section_header(line):
                    current_section = line.strip()
                page_text_blocks.append(line)
            
            full_page_text = "\n".join(page_text_blocks)
            
            # Perform overlapping character chunking (512 chars, 50 overlap)
            start = 0
            text_length = len(full_page_text)

            while start < text_length:
                end = start + self.chunk_size
                chunk_text = full_page_text[start:end].strip()

                if chunk_text:
                    chunk_id = f"{doc_id}_p{page.page_number}_c{chunk_index}"
                    chunk_meta = {
                        "doc_id": doc_id,
                        "filename": filename,
                        "page_number": page.page_number,
                        "section": current_section,
                        "chunk_id": chunk_id,
                    }
                    
                    chunks.append(
                        Chunk(
                            chunk_id=chunk_id,
                            doc_id=doc_id,
                            filename=filename,
                            page_number=page.page_number,
                            section=current_section,
                            text=chunk_text,
                            metadata=chunk_meta
                        )
                    )
                    chunk_index += 1

                if end >= text_length:
                    break
                start += (self.chunk_size - self.chunk_overlap)

        return chunks
