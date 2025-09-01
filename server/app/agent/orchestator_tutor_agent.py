import json
import os

from app.agent.code_agent import CodeAgent
from app.agent.knowledge_agent import KnowledgeAgent
from app.agent.prompts.orchestrator_agent_prompt import build_routing_prompt
from app.agent.prompts.orchestrator_agent_prompt import keyword_router
from app.agent.quiz_agent import QuizAgent
from app.agent.roadmap_agent import RoadmapAgent
from app.agent.visual_learning_agent import VisualLearningAgent
from app.config.logger_config import logger
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class TutorAgent:
    def __init__(self):
        self.code_agent = CodeAgent()
        self.quiz_agent = QuizAgent()
        self.visual_agent = VisualLearningAgent()
        self.roadmap_agent = RoadmapAgent()
        self.knowledge_agent = KnowledgeAgent()

        self.agents = {
            "CodeAgent": self.code_agent,
            "QuizAgent": self.quiz_agent,
            "VisualLearningAgent": self.visual_agent,
            "RoadmapAgent": self.roadmap_agent,
            "KnowledgeAgent": self.knowledge_agent,
        }

    def route_query_llm(self, query: str) -> str:
        prompt = build_routing_prompt(query)
        api_response = client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        try:
            data = json.loads(api_response.text)
            agent_name = data.get("agent", "KnowledgeAgent").strip()
            if agent_name not in self.agents:
                agent_name = "KnowledgeAgent"
        except Exception:
            agent_name = "KnowledgeAgent"

        return agent_name

    def run(self, query: str, chat_history: list):
        try:

            agent_name = keyword_router(query)

            if not agent_name:
                agent_name = self.route_query_llm(query)

            if agent_name not in self.agents:
                agent_name = "KnowledgeAgent"

            logger.info(f"Selected {agent_name} for the query")
            return self.agents[agent_name].run(query, chat_history)
        except Exception as e:
            logger.exception(f"TutorAgent.run() failed: {e}")
            return {
                "component_type": "knowledge",
                "title": "Error",
                "content": str(e),
                "features": [],
            }


ai_tutor_agent = TutorAgent()
