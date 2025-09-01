from app.agent.orchestator_tutor_agent import ai_tutor_agent
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

        response = ai_tutor_agent.run(query, chat_history, user)

        # Ensure ui_components is always a list
        if isinstance(response, dict):
            if "ui_components" in response:
                ui_components = response["ui_components"]
            else:
                ui_components = [response]
        elif isinstance(response, list):
            ui_components = response
        else:
            raise ValueError("Invalid response format from agent")

        # Log and save each component separately
        for comp in ui_components:
            logger.info(f"{chat_id}: LLM component response: {comp}")
            content = comp.get("content", "")
            logger.info(f"{chat_id}: LLM component content: {content}")
            save_message(db, chat_id, query, content)

        return chat_id, {"ui_components": ui_components}

    except Exception as e:
        logger.exception(f"{chat_id}: Error in chat request: {e}")
        save_message(db, chat_id, query, str(e))
        return chat_id, {
            "ui_components": [
                {
                    "component_type": "knowledge",
                    "title": "Error",
                    "content": str(e),
                    "features": [],
                }
            ]
        }
