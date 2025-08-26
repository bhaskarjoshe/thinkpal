import json
import os
import re
import uuid

from app.config.logger import logger
from app.services.knowledge_base import search_in_knowledge_base
from app.services.prompt import build_prompt
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class TutorAgent:
    def __init__(self):
        if not os.getenv("GEMINI_API_KEY"):
            logger.error(
                "GEMINI_API_KEY is missing! Please set it in your environment."
            )

    def run(self, query: str, chat_id: str = None):
        if not chat_id:
            chat_id = str(uuid.uuid4())

        response = {
            "component_type": "card",
            "title": "Error",
            "content": "Something went wrong",
            "features": [],
        }

        try:
            kb_result = search_in_knowledge_base(query)
            logger.info(f"KB result: {kb_result}")

            prompt = build_prompt(query, kb_result)
            logger.info(f"Prompt: {prompt}")

            api_response = client.models.generate_content(
                model="gemini-2.5-flash", contents=prompt
            )

            parsed = json.loads(api_response.text)
            return parsed

        except Exception as e:
            logger.exception(f"TutorAgent.run() failed: {e}")
            response["content"] = str(e)
            return response


ai_tutor_agent = TutorAgent()
