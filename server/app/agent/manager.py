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

    # -------------------------
    # Main Entry
    # -------------------------
    def run_agent(self, query, chat_history, user, chat_id):
        """Main entrypoint: routes query and executes agents."""
        try:
            session_id = self._create_session(
                chat_id, f"user_{user.id}" if user else "anonymous"
            )

            # Special init command
            if query == "__INIT__":
                return self._handle_welcome_message(user)

            # Step 1: Routing
            agent_names = self._route_query(query, chat_history, user, session_id)

            # Step 2: Execute selected agents
            final_responses = self._run_selected_agents(
                agent_names, query, chat_history, user, session_id
            )
            return {"tool_responses": final_responses}

        except Exception as e:
            logger.exception(f"Error running agent for chat {chat_id}: {e}")
            return self._error_response(str(e))

    # -------------------------
    # Routing
    # -------------------------
    def _route_query(self, query, chat_history, user, session_id):
        """Send query to TutorAgent and get routing decision."""
        input_text = self._prepare_input(query, chat_history, user, routing=True)
        content_message = Content(role="user", parts=[Part(text=input_text)])

        logger.info(f"Routing query: {query}")
        routing_gen = self.runner.run(
            user_id=f"user_{user.id if user else 'anon'}",
            session_id=session_id,
            new_message=content_message,
        )
        return self._extract_routing_response(routing_gen)

    def _extract_routing_response(self, response_gen):
        """Parse TutorAgent response -> list of agent names."""
        try:
            response_text = self._collect_text_from_gen(response_gen)
            clean_text = self._strip_markdown_fences(response_text)

            # Try JSON parse first
            agents = self._parse_routing_json(clean_text)
            if agents:
                return agents

            # Fallback: keyword search
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

    # -------------------------
    # Agent Execution
    # -------------------------
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
        input_text = self._prepare_input(query, chat_history, user, routing=False)
        message = Content(role="user", parts=[Part(text=input_text)])

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
            return self._parse_agent_json(full_response) or full_response
        except Exception as e:
            logger.exception(f"Error extracting agent response: {e}")
            return "Response extraction failed"

    # -------------------------
    # Shared Helpers
    # -------------------------
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

    # -------------------------
    # Session + User-Facing
    # -------------------------
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

    def _prepare_input(
        self, query: str, chat_history: List[dict], user: Optional[Any], routing=False
    ) -> str:
        """Create input prompt for agents or router."""
        history = "\n".join(
            [f"{m['role'].capitalize()}: {m['content']}" for m in chat_history[-5:]]
        )
        if routing:
            return f"Chat History:\n{history}\n\nCurrent Query: {query}\nUser: {user.name if user else 'Anonymous'}\n\nPlease decide which agents should handle this query."
        return f"Chat History:\n{history}\n\nCurrent Query: {query}\nUser: {user.name if user else 'Anonymous'}\n\nPlease provide a detailed response."

    def _handle_welcome_message(self, user):
        """Generate personalized welcome message."""
        try:
            info = {
                "name": getattr(user, "name", "Guest"),
                "semester": getattr(user, "semester", "Unknown"),
                "skills": getattr(user, "skills", []),
                "interests": getattr(user, "interests", []),
                "languages": getattr(user, "programming_languages", []),
            }
            welcome = f"""Welcome {info['name']} 👋
Semester: {info['semester']}
Skills: {', '.join(info['skills']) or 'None specified'}
Interests: {', '.join(info['interests']) or 'None specified'}
Programming Languages: {', '.join(info['languages']) or 'None specified'}

What would you like to learn today?"""

            return {
                "ui_components": [
                    {
                        "component_type": "knowledge",
                        "title": "Welcome",
                        "content": welcome,
                        "features": ["welcome"],
                    }
                ]
            }
        except Exception:
            return self._error_response("Welcome message failed")

    def _error_response(self, content: str):
        return {
            "ui_components": [
                {
                    "component_type": "knowledge",
                    "title": "Error",
                    "content": content,
                    "features": [],
                }
            ]
        }


agent_manager = AgentManager()
