import os

from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class RoadmapAgent:
    """
    Generates structured learning roadmaps for CSE topics.
    """

    def run(self, query: str, chat_history: list):
        try:
            messages = []

            messages.append(
                {
                    "role": "system",
                    "parts": [
                        "You are a Roadmap Assistant for Computer Science students. "
                        "Always provide structured learning plans in JSON format. "
                        "Each roadmap should include: stages, topics, recommended resources, and expected outcomes. "
                        "Keep it actionable and educational."
                    ],
                }
            )

            if chat_history:
                for msg in chat_history:
                    messages.append({"role": "user", "parts": [msg["query"]]})
                    messages.append({"role": "model", "parts": [msg["response"]]})

            messages.append({"role": "user", "parts": [query]})

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=messages,
            )

            return {
                "component_type": "roadmap",
                "title": "Learning Roadmap",
                "content": response.text,
                "features": ["roadmap", "learning", "CSE"],
            }

        except Exception as e:
            return {
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
