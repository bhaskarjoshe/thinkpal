import json
import os
import re

import requests
from app.config.logger import logger
from app.services.knowledge_base import search_in_knowledge_base
from app.services.prompt import build_prompt
from app.services.prompt import ui_schema
from dotenv import load_dotenv

load_dotenv()


class FallBackTutorAgent:
    def __init__(self):
        self.schema = ui_schema
        self.api_key = os.getenv("OPENROUTER_API_KEY")

        if not self.api_key:
            logger.error(
                "OPENROUTER_API_KEY is missing! Please set it in your environment."
            )

    def run(self, query: str):
        kb_result = search_in_knowledge_base(query)

        prompt = build_prompt(query, kb_result)

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Tutor",
        }

        payload = {
            "model": "mistralai/mistral-small-3.2-24b-instruct:free",
            "messages": [
                {"role": "system", "content": "You are an AI Tutor."},
                {"role": "user", "content": prompt},
            ],
        }

        try:
            resp = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            data = resp.json()
            logger.info(f"OpenRouter raw response: {data}")

            if "choices" in data:
                content = data["choices"][0]["message"]["content"]

                # 🔹 Strip code fences if present
                match = re.search(r"\{.*\}", content, re.DOTALL)
                if match:
                    content = match.group(0)

                try:
                    parsed = json.loads(content)
                    logger.info(f"Parsed JSON response: {parsed}")
                    return parsed
                except Exception as e:
                    logger.error(f"JSON parse failed: {e}")
                    return {
                        "component_type": "card",
                        "title": "Error",
                        "content": f"Invalid JSON from LLM: {content}",
                        "features": [],
                    }

            else:
                error_msg = data.get("error", "Unknown error")
                return {
                    "component_type": "card",
                    "title": "Error",
                    "content": f"API error: {error_msg}",
                    "features": [],
                }

        except Exception as e:
            logger.exception("OpenRouter call failed")
            return {
                "component_type": "card",
                "title": "Error",
                "content": f"API call failed: {e}",
                "features": [],
            }


# Singleton instance
fallback_ai_tutor_agent = FallBackTutorAgent()
