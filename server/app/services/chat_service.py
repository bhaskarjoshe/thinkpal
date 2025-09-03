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

        for comp in ui_components:
            logger.info(f"{chat_id}: UI component: {comp}")
            content = comp.get("content", "")
            logger.info(f"{chat_id}: Component content: {content}")
            save_message(db, chat_id, query, content)

        return chat_id, {"ui_components": ui_components}

    except Exception as e:
        logger.exception(f"{chat_id}: Error in chat request: {e}")
        save_message(db, chat_id, query, str(e))
        return chat_id, _error_ui_component(str(e))


def _format_response_to_ui_components(response):
    """Normalize agent/tool responses into a consistent UI components list."""
    if isinstance(response, dict):
        if "ui_components" in response:
            return response["ui_components"]
        if "tool_responses" in response:
            return _convert_tool_responses_to_ui_components(response["tool_responses"])
        return [response]

    if isinstance(response, list):
        return response

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

        if isinstance(response_content, dict):
            ui_components.append(
                _ensure_ui_component_defaults(response_content, tool_name)
            )
        else:
            comp_type = _map_tool_to_component_type(tool_name)
            ui_components.append(
                {
                    "component_type": comp_type,
                    "title": f"{tool_name} Response",
                    "content": response_content,
                    "features": [comp_type],
                }
            )
    return ui_components


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
