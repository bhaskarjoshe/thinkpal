import json
import os

from app.agent.prompt import build_base_tutor_prompt
from app.services.knowledge_base_service import search_in_knowledge_base
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class KnowledgeAgent:
    """
    Fallback agent using knowledge base + Gemini GenAI.
    """

    def run(self, query: str):
        kb_result = search_in_knowledge_base(query)
        prompt = build_base_tutor_prompt(query, kb_result)
        api_response = client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        return json.loads(api_response.text)
