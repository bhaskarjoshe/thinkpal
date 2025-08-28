import json
import os

from app.services.knowledge_base_service import search_in_knowledge_base
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class QuizAgent:
    """
    Generates quizzes (MCQs, fill-in-the-blank, or exercises) using Gemini LLM with structured JSON.
    """

    def run(self, query: str, chat_history: list):
        try:
            kb_result = search_in_knowledge_base(query)

            messages = []

            messages.append(
                {
                    "role": "system",
                    "parts": [
                        "You are a Quiz Generator AI for Computer Science students. "
                        "Always return JSON ONLY, never plain text. "
                        "The JSON must follow this schema:\n"
                        "{\n"
                        '  "component_type": "quiz",\n'
                        '  "title": "string",\n'
                        '  "content": "string (main explanation)",\n'
                        '  "content_json": {"questions": [{"question": "string", "options": ["A", "B", "C"], "answer": "A"}]},\n'
                        '  "features": ["quiz", "practice", "CSE"]\n'
                        "}\n\n"
                        "Generate varied formats: MCQs, fill-in-the-blank, or coding exercises. "
                        "Make questions contextual and educational."
                    ],
                }
            )

            if kb_result:
                messages.append(
                    {
                        "role": "system",
                        "parts": [f"Knowledge Base Context: {kb_result}"],
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

            try:
                parsed_response = json.loads(response.text)
                if parsed_response.get("content_text"):
                    parsed_response["content"] += " " + parsed_response["content_text"]
            except Exception:
                parsed_response = {
                    "component_type": "quiz",
                    "title": "Quiz",
                    "content": response.text,
                    "features": ["quiz", "practice", "CSE"],
                }

            return parsed_response

        except Exception as e:
            return {
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
