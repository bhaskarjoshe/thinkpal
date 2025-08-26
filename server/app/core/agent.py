import json
import os
import re

import requests
from app.config.logger import logger
from dotenv import load_dotenv

load_dotenv()


# -----------------------------
# Knowledge Base tool
# -----------------------------
def search_kb(query: str):
    knowledge = {
        "ai": [
            "Learning from data",
            "Reasoning",
            "Natural language",
            "Decision-making",
        ],
        "ml": ["Supervised", "Unsupervised", "Reinforcement learning"],
    }
    for key, facts in knowledge.items():
        if key in query.lower():
            logger.info(f"KB match found for '{key}' → {facts}")
            return {"facts": facts}

    logger.info(f"No KB match found for query: {query}")
    return {"facts": []}


# -----------------------------
# Schema for UI components
# -----------------------------
ui_schema = {
    "type": "object",
    "properties": {
        "component_type": {"type": "string", "enum": ["card", "quiz", "list"]},
        "title": {"type": "string"},
        "content": {"type": "string"},
        "features": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["component_type", "title", "content"],
}


# -----------------------------
# Orchestrator Agent
# -----------------------------
class TutorAgent:
    def __init__(self):
        self.schema = ui_schema
        self.api_key = os.getenv("OPENROUTER_API_KEY")

        if not self.api_key:
            logger.error(
                "OPENROUTER_API_KEY is missing! Please set it in your environment."
            )

    def run(self, query: str):
        kb_result = search_kb(query)

        prompt = f"""
        You are an AI Tutor.
        Respond ONLY with JSON matching this schema: {self.schema}.
        Query: {query}
        Knowledge: {kb_result}
        """

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
ai_tutor_agent = TutorAgent()
