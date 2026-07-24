import re

class TextCleaner:
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Sanitizes and normalizes extracted text.
        """
        if not text:
            return ""
        
        # Remove null characters
        text = text.replace("\x00", " ")
        
        # Normalize non-breaking spaces and tabs
        text = re.sub(r"[\r\t\f]", " ", text)
        
        # Consolidate multiple spaces
        text = re.sub(r"[ ]+", " ", text)
        
        # Consolidate multiple newlines (keep maximum 2)
        text = re.sub(r"\n\s*\n", "\n\n", text)
        
        return text.strip()
