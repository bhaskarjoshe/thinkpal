import json
import os

from app.agent.prompts.orchestrator_agent_prompt import build_routing_prompt
from app.agent.prompts.orchestrator_agent_prompt import tools
from google import genai

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

    return agent_name
