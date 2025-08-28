import json
import os

from app.agent.prompt import build_routing_prompt
from app.agent.prompt import tools
from google import genai
from app.config.logger_config import logger

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def route_query_llm(query: str) -> str:
    prompt = build_routing_prompt(query)
    api_response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt
    )
    try:
        data = json.loads(api_response.text)
        agent_name = data.get("agent", "KnowledgeAgent").strip()
        if agent_name not in tools:
            agent_name = "KnowledgeAgent"
    except Exception:
        agent_name = "KnowledgeAgent"

    logger.info(f"Route query LLM: {agent_name}")
    return agent_name
