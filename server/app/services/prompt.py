from app.config.logger import logger
from app.schemas.ui import ui_schema

BASE_TUTOR_PROMPT = """
You are an AI Tutor. Respond ONLY in JSON.

JSON must strictly match this schema: {schema}

Always respond using this template exactly (fill in the fields):
{{
    "component_type": "card",
    "title": "Brief descriptive heading",
    "content": "Explain the concept clearly using examples",
    "features": ["list", "of", "important", "tags"]
}}

Do NOT write anything outside the JSON object. No markdown, no extra text.

User Query: {query}
Knowledge Base: {kb_result}
"""


def build_prompt(query: str, kb_result: dict):

    try:
        prompt = BASE_TUTOR_PROMPT.format(
            schema=ui_schema, query=query, kb_result=kb_result
        )
        return prompt
    except Exception as e:
        logger.exception(f"Error building prompt: {e}")
        return f"User Query: {query}\nKnowledge Base: {kb_result}"
