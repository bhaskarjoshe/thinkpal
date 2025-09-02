import json
import os

from app.agent.code_agent import CodeAgent
from app.agent.knowledge_agent import KnowledgeAgent
from app.agent.prompts.orchestrator_agent_prompt import ROUTING_PROMPT
from app.agent.prompts.welcome_prompt import WELCOME_PROMPT
from app.agent.quiz_agent import QuizAgent
from app.agent.roadmap_agent import RoadmapAgent
from app.agent.visual_learning_agent import VisualLearningAgent
from app.config.logger_config import logger
from app.models.user_model import User
from app.schemas.ui_schema import UIComponent
from app.utils.history_cleaner import clean_chat_history
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class TutorAgent:
    def __init__(self):
        self.code_agent = CodeAgent()
        self.quiz_agent = QuizAgent()
        self.visual_agent = VisualLearningAgent()
        self.roadmap_agent = RoadmapAgent()
        self.knowledge_agent = KnowledgeAgent()
        self.user = None
        self.agents = {
            "CodeAgent": self.code_agent,
            "QuizAgent": self.quiz_agent,
            "VisualLearningAgent": self.visual_agent,
            "RoadmapAgent": self.roadmap_agent,
            "KnowledgeAgent": self.knowledge_agent,
        }

    def route_query_llm(self, query: str, chat_history: list) -> list:
        """Call routing LLM once to decide which agent(s) should handle the query."""
        clean_history = clean_chat_history(chat_history)
        history_text = "\n".join(
            [f"{m['role'].capitalize()}: {m['content']}" for m in clean_history]
        )

        prompt = ROUTING_PROMPT.format(query=query, chat_history=history_text)
        try:
            api_response = client.models.generate_content(
                model="gemini-2.5-flash", contents=prompt
            )
            raw_text = api_response.candidates[0].content.parts[0].text.strip()

            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`")
                if raw_text.lower().startswith("json"):
                    raw_text = raw_text[4:].strip()
            if not raw_text.strip():
                raise ValueError("Empty response")
            data = json.loads(raw_text)
            agents = data.get("agents", [])
            if not isinstance(agents, list) or not agents:
                agents = ["KnowledgeAgent"]
            agents = [a for a in agents if a in self.agents]
            if not agents:
                agents = ["KnowledgeAgent"]
        except Exception as e:
            logger.warning(f"Routing LLM failed: {e}")
            agents = ["KnowledgeAgent"]

        return agents

    def route_welcome_message(self, user: User):
        try:
            self.user = user
            prompt = WELCOME_PROMPT.format(
                name=self.user.name,
                semester=self.user.semester or "Unknown",
                skills=", ".join(self.user.skills or []),
                interests=", ".join(self.user.interests or []),
                programming_languages=", ".join(self.user.programming_languages or []),
            )
            api_response = client.models.generate_content(
                model="gemini-2.5-flash", contents=prompt
            )
            raw_text = api_response.candidates[0].content.parts[0].text.strip()

            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`")
                if raw_text.lower().startswith("json"):
                    raw_text = raw_text[4:].strip()
            return json.loads(raw_text)
        except Exception as e:
            logger.exception(f"Failed to build welcome message: {e}")
            return {
                "component_type": "knowledge",
                "title": "Welcome 👋",
                "content": "Hello! Welcome to ThinkPal. What would you like to learn today?",
                "features": ["welcome"],
            }

    def run(self, query: str, chat_history: list, user: User):
        try:
            if query == "__INIT__":
                # wrap single component in a list
                return {"ui_components": [self.route_welcome_message(user)]}

            selected_agents = self.route_query_llm(query, chat_history)
            logger.info(f"Selected agents: {selected_agents}")

            ui_components = []

            for agent_name in selected_agents:
                if agent_name in self.agents:
                    try:
                        resp = self.agents[agent_name].run(query, chat_history)
                        logger.info(f"Response from {agent_name}: {resp}")
                        # wrap each response as a UIComponent
                        ui_components.append(resp)
                    except Exception as agent_error:
                        logger.exception(f"{agent_name} failed: {agent_error}")
                        ui_components.append(
                            UIComponent(
                                component_type="knowledge",
                                title=f"{agent_name} Error",
                                content=str(agent_error),
                                features=[],
                            )
                        )

            return {"ui_components": ui_components}

        except Exception as e:
            logger.exception(f"Error in run(): {e}")
            return {
                "ui_components": [
                    UIComponent(
                        component_type="knowledge",
                        title="Error",
                        content=str(e),
                        features=[],
                    )
                ]
            }


# Singleton instance
ai_tutor_agent = TutorAgent()
