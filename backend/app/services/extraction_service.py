from typing import List, Dict, Set
import re

class ExtractionService:
    def __init__(self):
        # Simple keyword maps for demo purposes
        # In a real app, these could be loaded from a database or use a more advanced NLP model
        self.interest_keywords = {
            "sports": ["cricket", "football", "soccer", "basketball", "tennis", "golf", "swimming"],
            "technology": ["coding", "programming", "python", "javascript", "ai", "machine learning", "tech"],
            "arts": ["painting", "drawing", "music", "guitar", "piano", "dance", "photography"],
            "leisure": ["gaming", "movies", "reading", "traveling", "cooking", "hiking"],
        }
        
        self.mood_keywords = {
            "happy": ["happy", "excited", "joyful", "glad", "great", "awesome", "wonderful"],
            "stressed": ["stressed", "anxious", "worried", "overwhelmed", "pressure", "tired"],
            "sad": ["sad", "depressed", "lonely", "unhappy", "down"],
            "angry": ["angry", "frustrated", "annoyed", "pissed", "mad"],
            "neutral": ["fine", "okay", "ok", "normal", "neutral"]
        }

    def extract_insights(self, text: str) -> Dict[str, List[str]]:
        """
        Extracts interests and detected mood from user text using keyword matching.
        """
        text_lower = text.lower()
        
        detected_interests = []
        detected_moods = []

        # Extract Interests
        for category, keywords in self.interest_keywords.items():
            for keyword in keywords:
                # Use regex to match whole words only
                if re.search(rf"\b{re.escape(keyword)}\b", text_lower):
                    # We return the specific keyword found as the interest
                    if keyword not in detected_interests:
                        detected_interests.append(keyword)

        # Extract Moods
        for mood, keywords in self.mood_keywords.items():
            for keyword in keywords:
                if re.search(rf"\b{re.escape(keyword)}\b", text_lower):
                    if mood not in detected_moods:
                        detected_moods.append(mood)

        return {
            "interests": detected_interests,
            "moods": detected_moods
        }

extraction_service = ExtractionService()
