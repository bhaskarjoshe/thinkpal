import json

from app.agent.manager import agent_manager
from app.config.logger_config import logger
from app.db.chat import create_chat_session
from app.db.chat import get_chat_history
from app.db.chat import save_message
from app.models.user_model import User
from app.utils.chat_serializer import serialize_chat_history
from sqlalchemy.orm import Session


def handle_chat_request(chat_id: str, query: str, db: Session, user: User):
    try:
        logger.info(f"{chat_id}: User Query: {query}")
        create_chat_session(db, chat_id, user_id=user.id, title=query)

        chat_history_db = get_chat_history(db, chat_id)
        chat_history = serialize_chat_history(chat_history_db)
        logger.debug(f"{chat_id}: Chat history: {chat_history}")

        response = agent_manager.run_agent(query, chat_history, user, chat_id)
        logger.info(f"{chat_id}: Agent manager response: {response}")

        ui_components = _format_response_to_ui_components(response)

        # save messages in DB
        for comp in ui_components:
            content = comp.get("content", "")
            # if content is JSON string, convert to text for DB
            if isinstance(content, dict):
                content_to_save = json.dumps(content)
            else:
                content_to_save = str(content)
            save_message(db, chat_id, query, content_to_save)
            logger.info(f"{chat_id}: Saved component: {comp['title']}")

        return chat_id, {"ui_components": ui_components}

    except Exception as e:
        logger.exception(f"{chat_id}: Error in chat request: {e}")
        save_message(db, chat_id, query, str(e))
        return chat_id, _error_ui_component(str(e))


def _format_response_to_ui_components(response):
    """Normalize agent/tool responses into a consistent UI components list."""
    if isinstance(response, dict):
        if "ui_components" in response:
            return [_parse_content_json(comp) for comp in response["ui_components"]]
        if "tool_responses" in response:
            return _convert_tool_responses_to_ui_components(response["tool_responses"])
        return [_parse_content_json(response)]

    if isinstance(response, list):
        return [_parse_content_json(comp) for comp in response]

    return [
        {
            "component_type": "knowledge",
            "title": "Response",
            "content": str(response),
            "features": ["knowledge"],
        }
    ]


def _convert_tool_responses_to_ui_components(tool_responses):
    """Convert tool responses from agents to UI components format."""
    ui_components = []
    for tool_response in tool_responses:
        tool_name = tool_response.get("tool", "Unknown")
        response_content = tool_response.get("response", "")

        # If response is a string but looks like JSON, parse it
        if isinstance(response_content, str):
            try:
                parsed_response = json.loads(response_content)
                response_content = _ensure_ui_component_defaults(
                    parsed_response, tool_name
                )
            except json.JSONDecodeError:
                # fallback to string content
                comp_type = _map_tool_to_component_type(tool_name)
                response_content = {
                    "component_type": comp_type,
                    "title": f"{tool_name} Response",
                    "content": response_content,
                    "features": [comp_type],
                }

        elif isinstance(response_content, dict):
            response_content = _ensure_ui_component_defaults(
                response_content, tool_name
            )

        ui_components.append(response_content)

    return ui_components


def _parse_content_json(component: dict):
    """Parse nested JSON in `content` if it's a stringified JSON."""
    if component.get("component_type") == "code" and isinstance(
        component.get("content"), str
    ):
        try:
            parsed = json.loads(component["content"])
            return _ensure_ui_component_defaults(
                parsed, component.get("title", "CodeAgent")
            )
        except Exception:
            return component
    return component


def _ensure_ui_component_defaults(ui_component: dict, tool_name: str):
    """Ensure required keys exist in a UI component dict."""
    if "component_type" not in ui_component:
        ui_component["component_type"] = _map_tool_to_component_type(tool_name)
    if "title" not in ui_component:
        ui_component["title"] = f"{tool_name} Response"
    if "features" not in ui_component:
        ui_component["features"] = [ui_component["component_type"]]
    return ui_component


def _map_tool_to_component_type(tool_name: str):
    """Map tool/agent names to UI component types."""
    tool_mapping = {
        "CodeAgent": "code",
        "QuizAgent": "quiz",
        "VisualLearningAgent": "visual",
        "RoadmapAgent": "roadmap",
        "KnowledgeAgent": "knowledge",
        "route_welcome_tool": "welcome",
        "route_query_tool": "query",
    }
    return tool_mapping.get(tool_name, "knowledge")


def _error_ui_component(error_message: str):
    """Return UI component for error messages."""
    return {
        "ui_components": [
            {
                "component_type": "knowledge",
                "title": "Error",
                "content": error_message,
                "features": [],
            }
        ]
    }
