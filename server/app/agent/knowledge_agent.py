import os
import json
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class KnowledgeAgent:
    """
    Provides factual knowledge responses from the model.
    Ensures output is always JSON with `component_type`, `title`, `content`,
    `features`, and `next_topics_to_learn`.
    """

    def __init__(self):
        self.client = client

    def run(self, query: str, chat_history: list):
        try:
            # Convert chat history into Gemini format
            contents = []
            for msg in chat_history:
                contents.append(
                    {"role": msg["role"], "parts": [{"text": msg["content"]}]}
                )

            # Stronger system prompt to enforce JSON
            system_prompt = """
            You are a knowledge agent. 
            IMPORTANT: Always respond in **valid JSON only**. 
            Do NOT include markdown, explanations, or extra text.

            The JSON must strictly follow this schema:
            {
              "component_type": "knowledge",
              "title": "string",
              "content": "string",
              "features": ["string", "string", "string"],
              "next_topics_to_learn": ["string", "string", "string"]
            }

            - "title": a short descriptive title of the answer
            - "content": a concise, factual explanation for the query
            - "features": exactly 3 relevant keywords
            - "next_topics_to_learn": exactly 3 suggested follow-up topics
            """

            # Add system prompt + query
            contents.append({"role": "user", "parts": [{"text": system_prompt}]})
            contents.append({"role": "user", "parts": [{"text": query}]})

            # Call Gemini API
            api_response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
            )

            raw_text = api_response.text.strip()

            # Clean possible ```json fences
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`")
                if raw_text.lower().startswith("json"):
                    raw_text = raw_text[4:].strip()

            # Try to parse JSON strictly
            try:
                parsed = json.loads(raw_text)
            except Exception:
                parsed = {
                    "component_type": "knowledge",
                    "title": "Knowledge Base",
                    "content": api_response.text,
                    "features": ["knowledge", "facts", "CSE"],
                    "next_topics_to_learn": [
                        "Advanced AI Concepts",
                        "Data Structures",
                        "Algorithms",
                    ],
                }

            return parsed

        except Exception as e:
            return {
                "component_type": "error",
                "title": "Knowledge Agent Error",
                "content": str(e),
                "features": [],
                "next_topics_to_learn": [],
            }
