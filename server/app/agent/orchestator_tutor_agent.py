from app.agent.code_agent import CodeAgent
from app.agent.knowledge_agent import KnowledgeAgent
from app.agent.llm_call import route_query_llm
from app.agent.prompt import keyword_router
from app.agent.quiz_agent import QuizAgent
from app.agent.roadmap_agent import RoadmapAgent
from app.agent.visual_learning_agent import VisualLearningAgent
from app.config.logger_config import logger


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

    def run(self, query: str, chat_history: list):
        try:
            agent_name = keyword_router(query)

            if not agent_name:
                agent_name = route_query_llm(query)
            logger.info(f"Selected {agent_name} for the query")
            return self.agents[agent_name].run(query, chat_history)
        except Exception as e:
            logger.exception(f"TutorAgent.run() failed: {e}")
            return {
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }


ai_tutor_agent = TutorAgent()
