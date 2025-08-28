# app/agent/quiz_agent.py
import json
import os

from app.agent.prompt import BASE_TUTOR_PROMPT
from app.services.knowledge_base_service import search_in_knowledge_base
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class QuizAgent:
    """
    Generates quizzes (MCQs or fill-in-the-blank) using Gemini LLM with structured JSON.
    """

    def run(self, query: str, chat_id: str = None):
        try:
            kb_result = search_in_knowledge_base(query)

            schema = "{'component_type': 'quiz', 'title': 'string', 'content': 'string', 'features': ['string']}"
            prompt = BASE_TUTOR_PROMPT.format(
                schema=schema, query=query, kb_result=kb_result
            )

            api_response = client.models.generate_content(
                model="gemini-2.5-flash", contents=prompt
            )

            try:
                parsed_response = json.loads(api_response.text)
            except Exception:
                parsed_response = {
                    "component_type": "quiz",
                    "title": "Quiz",
                    "content": api_response.text,
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
