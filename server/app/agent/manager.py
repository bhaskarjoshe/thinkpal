import asyncio
import json
from typing import Any
from typing import List
from typing import Optional

from app.agent.agent import code_agent
from app.agent.agent import knowledge_agent
from app.agent.agent import quiz_agent
from app.agent.agent import roadmap_agent
from app.agent.agent import tutor_agent
from app.agent.agent import visual_agent
from app.agent.prompts.orchestrator_prompt import ROUTING_PROMPT
from app.agent.prompts.welcome_prompt import WELCOME_PROMPT
from app.config.logger_config import logger
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content
from google.genai.types import Part


class AgentManager:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            logger.info("Initializing global agents...")
            self.session_service = InMemorySessionService()
            self.agents = {
                "KnowledgeAgent": knowledge_agent,
                "CodeAgent": code_agent,
                "QuizAgent": quiz_agent,
                "RoadmapAgent": roadmap_agent,
                "VisualLearningAgent": visual_agent,
                "TutorAgent": tutor_agent,
            }
            self.runner = Runner(
                agent=self.agents["TutorAgent"],
                app_name="TutorApp",
                session_service=self.session_service,
            )
            logger.info("Global agents initialized successfully")
            self._initialized = True

    def run_agent(self, query, chat_history, user, chat_id):
        """Main entrypoint: routes query and executes agents."""
        try:
            session_id = self._create_session(
                chat_id, f"user_{user.id}" if user else "anonymous"
            )

            if query == "__INIT__":
                self.runner.agent.instruction = WELCOME_PROMPT.format(
                    name=getattr(user, "name", "Guest"),
                    semester=getattr(user, "semester", "Unknown"),
                    skills=", ".join(getattr(user, "skills", []) or []),
                    interests=", ".join(getattr(user, "interests", []) or []),
                    programming_languages=", ".join(
                        getattr(user, "programming_languages", []) or []
                    ),
                )
            else:
                self.runner.agent.instruction = ROUTING_PROMPT

            content_message = Content(role="user", parts=[Part(text=query)])

            logger.info(f"Running TutorAgent for query: {query}")
            response_gen = self.runner.run(
                user_id=f"user_{user.id if user else 'anon'}",
                session_id=session_id,
                new_message=content_message,
            )

            if query == "__INIT__":
                response = self._extract_agent_response(response_gen)
                return {
                    "ui_components": (
                        [response]
                        if isinstance(response, dict)
                        else [
                            {
                                "component_type": "knowledge",
                                "title": "Welcome",
                                "content": str(response),
                                "features": ["welcome"],
                            }
                        ]
                    )
                }

            agent_names = self._extract_routing_response(response_gen)
            final_responses = self._run_selected_agents(
                agent_names, query, chat_history, user, session_id
            )
            return {"tool_responses": final_responses}

        except Exception as e:
            logger.exception(f"Error running agent for chat {chat_id}: {e}")
            return self._error_response(str(e))

    def _extract_routing_response(self, response_gen):
        """Parse TutorAgent response -> list of agent names."""
        try:
            response_text = self._collect_text_from_gen(response_gen)
            clean_text = self._strip_markdown_fences(response_text)

            agents = self._parse_routing_json(clean_text)
            if agents:
                return agents

            found = [a for a in self.agents if a in clean_text]
            return found if found else ["KnowledgeAgent"]

        except Exception as e:
            logger.exception(f"Routing extraction failed: {e}")
            return ["KnowledgeAgent"]

    def _parse_routing_json(self, clean_text: str) -> Optional[List[str]]:
        """Parse TutorAgent response JSON safely."""
        try:
            if not clean_text:
                return None
            data = json.loads(clean_text)
            agents = data.get("agents", [])
            valid_agents = [a for a in agents if a in self.agents]
            if valid_agents:
                logger.info(f"Routing found agents: {valid_agents}")
                return valid_agents
            return None
        except json.JSONDecodeError:
            logger.warning(f"Failed to parse routing JSON: {clean_text}")
            return None

    def _run_selected_agents(self, agent_names, query, chat_history, user, session_id):
        """Execute the list of routed agents and return responses."""
        results = []
        for agent_name in agent_names:
            if agent_name not in self.agents:
                logger.warning(f"Unknown agent requested: {agent_name}")
                continue
            try:
                logger.info(f"Executing agent: {agent_name}")
                resp = self._execute_agent(
                    self.agents[agent_name], query, chat_history, user, session_id
                )
                results.append({"tool": agent_name, "response": resp})
            except Exception as e:
                logger.exception(f"Agent {agent_name} failed: {e}")
                results.append({"tool": agent_name, "response": f"Error: {str(e)}"})
        return results

    def _execute_agent(self, agent, query, chat_history, user, session_id):
        """Run selected agent + extract response."""
        runner = Runner(
            agent=agent, app_name="TutorApp", session_service=self.session_service
        )
        message = Content(role="user", parts=[Part(text=query)])

        agent_gen = runner.run(
            user_id=f"user_{user.id if user else 'anon'}",
            session_id=session_id,
            new_message=message,
        )
        return self._extract_agent_response(agent_gen)

    def _extract_agent_response(self, response_gen):
        """Combine agent responses and parse JSON if possible."""
        try:
            full_response = self._collect_text_from_gen(response_gen)
            if not full_response:
                return "No response generated"
            parsed = self._parse_agent_json(full_response)
            if not parsed:
                return full_response

            parsed = self._normalize_ui_component(parsed)
            return parsed
        except Exception as e:
            logger.exception(f"Error extracting agent response: {e}")
            return "Response extraction failed"

    def _normalize_ui_component(self, data: dict) -> dict:
        """Ensure UIComponent matches backend schema."""
        try:
            if data.get("component_type") == "roadmap":
                levels = data.get("levels")
                if levels:
                    data["content_json"] = {
                        "roadmap_type": data.get("roadmap_type", "structured"),
                        "levels": levels,
                    }
                    data.pop("levels", None)
                    data.pop("roadmap_type", None)
            return data
        except Exception as e:
            logger.exception(f"Failed to normalize UIComponent: {e}")
            return data


    def _collect_text_from_gen(self, response_gen) -> str:
        """Flatten generator output into a string."""
        parts = []
        for response in response_gen:
            if hasattr(response, "content") and response.content:
                if getattr(response.content, "text", None):
                    parts.append(response.content.text.strip())
                elif getattr(response.content, "parts", None):
                    parts.extend(
                        [
                            p.text.strip()
                            for p in response.content.parts
                            if getattr(p, "text", None)
                        ]
                    )
        return "".join(parts).strip()

    def _strip_markdown_fences(self, text: str) -> str:
        """Remove markdown code fences like ```json ...```."""
        if text.startswith("```json"):
            return text[7:-3].strip()
        if text.startswith("```"):
            return text[3:-3].strip()
        return text

    def _parse_agent_json(self, text: str):
        """Parse JSON safely if response looks like JSON."""
        try:
            clean_text = self._strip_markdown_fences(text.strip())
            if clean_text.startswith("{") and clean_text.endswith("}"):
                return json.loads(clean_text)
            return None
        except Exception:
            return None

    def _create_session(self, chat_id: str, user_id: str) -> str:
        """Ensure session exists synchronously."""
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        session = loop.run_until_complete(
            self.session_service.create_session(
                app_name="TutorApp",
                user_id=user_id or "anonymous",
                state={"chat_id": chat_id},
            )
        )
        logger.info(f"Created session: {session.id}")
        return session.id


agent_manager = AgentManager()
