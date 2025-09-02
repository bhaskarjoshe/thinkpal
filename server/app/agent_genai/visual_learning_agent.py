import json
import os

import requests
from app.agent.prompts.visual_agent_prompt import VISUAL_AGENT_PROMPT
from app.config.logger_config import logger
from app.utils.json_cleaner import clean_json_text
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

GOOGLE_CSE_API_KEY = os.getenv("GOOGLE_CSE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")


class VisualLearningAgent:
    """
    Generates a concise textual explanation along with a relevant image URL from Google.
    Handles chat history safely by summarizing context.
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
                "safe": "off",
            }
            response = requests.get(search_url, params=params)
            data = response.json()
            logger.info(f"Google CSE Response: {data}")
            if "items" in data and len(data["items"]) > 0:
                return data["items"][0]["link"]
            return ""
        except Exception as e:
            logger.exception("Error fetching image:", e)
            return ""

    def summarize_chat_history(self, chat_history: list) -> str:
        """Create a concise summary from last few messages."""
        if not chat_history:
            return ""
        last_msgs = [
            msg["content"] for msg in chat_history[-1:] if msg.get("role") == "user"
        ]
        return " ".join(last_msgs) if last_msgs else ""

    def run(self, query: str, chat_history: list):
        try:
            # Prepare context from chat history
            history_summary = self.summarize_chat_history(chat_history)
            user_input = (
                f"{history_summary} {query}".strip() if history_summary else query
            )

            # Generate minimal explanation using LLM
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[VISUAL_AGENT_PROMPT, user_input],
            )
            try:
                cleaned_text = clean_json_text(response.text)
                parsed = json.loads(cleaned_text)
                explanation = parsed.get(
                    "explanation", "Explanation could not be generated."
                )
            except Exception:
                explanation = (
                    response.text.strip() or "Explanation could not be generated."
                )

            # Fetch relevant image from Google
            search_query = f"{query} diagram"
            image_url = self.fetch_image_url(search_query)

            logger.info(f"Query: {query}")
            logger.info(f"Image URL: {image_url}")

            return {
                "component_type": "visual",
                "title": query,
                "content": explanation,
                "content_image": image_url,
                "features": ["visual", "diagram", "chart"],
            }

        except Exception as e:
            logger.exception("Error in VisualLearningAgent run:", e)
            return {
                "component_type": "knowledge",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
