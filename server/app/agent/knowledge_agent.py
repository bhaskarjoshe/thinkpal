import os

from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class KnowledgeAgent:
    """
    Provides factual knowledge responses from the model.
    """

    def __init__(self):
        self.client = client

    def run(self, query: str, chat_history: list):
        try:
            contents = []
            for msg in chat_history:
                contents.append(
                    {"role": msg["role"], "parts": [{"text": msg["content"]}]}
                )

            contents.append({"role": "user", "parts": [{"text": query}]})

            api_response = self.client.models.generate_content(
                model="gemini-2.5-flash", contents=contents
            )

            return {
                "component_type": "knowledge",
                "title": "Knowledge Base",
                "content": api_response.text,
                "features": ["knowledge", "facts", "CSE"],
            }

        except Exception as e:
            return {
                "component_type": "error",
                "title": "Knowledge Agent Error",
                "content": str(e),
                "features": [],
            }
