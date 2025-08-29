import os

import requests
from app.config.logger_config import logger
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

GOOGLE_CSE_API_KEY = os.getenv("GOOGLE_CSE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")


class VisualLearningAgent:
    """
    Generates short textual explanations with a relevant image URL from Google.
    """

    def fetch_image_url(self, query: str) -> str:
        """Fetch the first image URL from Google Custom Search."""
        try:
            search_url = "https://www.googleapis.com/customsearch/v1"
            params = {
                "key": GOOGLE_CSE_API_KEY,
                "cx": GOOGLE_CSE_ID,
                "q": query,
                "searchType": "image",
                "num": 1,
                "safe": "off",  # optional for testing
            }
            response = requests.get(search_url, params=params)
            data = response.json()
            if "items" in data and len(data["items"]) > 0:
                return data["items"][0]["link"]
            return ""
        except Exception as e:
            logger.exception("Error fetching image:", e)
            return ""

    def run(self, query: str, chat_history: list):
        try:
            # Minimal explanation from LLM
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a Visual Learning Assistant. "
                        "Provide a 1-2 sentence explanation of the topic. "
                        "Do NOT create flowcharts or long text. "
                        "Keep it concise and clear."
                    ),
                },
            ]

            # Add chat history as context
            for msg in chat_history:
                messages.append({"role": "user", "content": msg["query"]})
                messages.append({"role": "assistant", "content": msg["response"]})

            messages.append({"role": "user", "content": query})

            # Ask LLM to generate short explanation
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[m["content"] for m in messages],
            )

            explanation = response.text.strip() or "Explanation could not be generated."

            # Fetch relevant image from Google
            logger.info(f"Query: {query}")
            image_url = self.fetch_image_url(query)
            logger.info(f"Image URL: {image_url}")

            return {
                "component_type": "visual",
                "title": query,
                "content": explanation,
                "content_image": image_url,
                "features": ["visual", "diagram", "chart"],
            }

        except Exception as e:
            return {
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
