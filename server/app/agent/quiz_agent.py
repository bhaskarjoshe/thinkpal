import json
import os

from app.services.knowledge_base_service import search_in_knowledge_base
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class QuizAgent:
    """
    Generates quizzes (MCQs, true/false, or fill-in-the-blank) using Gemini LLM with structured JSON.
    """

    def run(self, query: str, chat_history: list):
        try:
            # Fetch relevant knowledge base content
            kb_result = search_in_knowledge_base(query)

            # Strong system prompt for structured JSON
            system_prompt = """
You are QuizAgent. Always respond with a JSON object that strictly follows this schema:

{
  "component_type": "quiz",
  "title": "string (title of the quiz)",
  "content": "string (intro/description of the quiz)",
  "content_json": {
    "quiz_type": "mcq",
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "answer": "string"
      }
    ]
  },
  "features": ["quiz", "practice"],
  "next_topics_to_learn": []
}

Rules:
- Generate exactly 5 questions unless specified otherwise.
- If quiz_type is "mcq", include 4 options per question.
- If "true_false", options should be ["True", "False"].
- If "fill_blank", no options, just the question and answer.
- Return only valid JSON. Do not include markdown fences or extra text.
"""

            # Convert chat history into Gemini-friendly format
            chat_history_text = ""
            for msg in chat_history:
                if msg["role"] == "user":
                    chat_history_text += f"User: {msg['content']}\n"
                elif msg["role"] == "assistant":
                    chat_history_text += f"Assistant: {msg['content']}\n"

            # Add knowledge base context if available
            kb_context = f"Knowledge Base Context: {kb_result}" if kb_result else ""

            # Build contents for Gemini API call
            contents = [
                kb_context.strip(),
                chat_history_text.strip(),
                system_prompt.strip(),
                f"User Query: {query}",
            ]

            # Call Gemini LLM
            api_response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
            )

            raw_text = api_response.text.strip()

            # Remove possible markdown/code fences
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`")
                if raw_text.lower().startswith("json"):
                    raw_text = raw_text[4:].strip()

            # Parse JSON strictly
            try:
                parsed_response = json.loads(raw_text)
            except Exception:
                # Fallback minimal valid quiz if parsing fails
                parsed_response = {
                    "component_type": "quiz",
                    "title": "Quiz",
                    "content": "Default quiz content because LLM output was invalid.",
                    "content_json": {
                        "quiz_type": "mcq",
                        "questions": [
                            {
                                "question": "Placeholder question",
                                "options": ["A", "B", "C", "D"],
                                "answer": "A",
                            }
                        ],
                    },
                    "features": ["quiz", "practice"],
                    "next_topics_to_learn": [],
                }

            return parsed_response

        except Exception as e:
            # Full error fallback
            return {
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
