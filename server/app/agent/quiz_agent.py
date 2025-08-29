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

            prompt = """
                You are QuizAgent. Always respond with a JSON object that follows this schema strictly:

                {
                "component_type": "quiz",
                "title": "string (title of the quiz)",
                "content": "string (intro/description of the quiz)",
                "content_json": {
                    "quiz_type": "mcq",  // or "true_false", "fill_blank"
                    "questions": [
                    {
                        "question": "string",
                        "options": ["string", "string", "string", "string"], // required for mcq
                        "answer": "string"
                    }
                    ]
                },
                "features": ["quiz", "practice"],
                "next_topics_to_learn": []
                }

                Rules:
                - Generate exactly 5 questions by default unless user specifies otherwise.
                - If quiz_type is "mcq", include 4 options per question.
                - If "true_false", options should be ["True", "False"].
                - If "fill_blank", no options, just the question and correct answer.
                
                MOST IMPORTANT- Return only valid JSON object. Do not include markdown code fences like json or .
                """

            if kb_result:
                prompt += f"Knowledge Base Context: {kb_result}\n\n"

            if chat_history:
                for msg in chat_history:
                    prompt += f"User: {msg['query']}\nAssistant: {msg['response']}\n"

            prompt += f"User: {query}\nAssistant:"

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt],
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
