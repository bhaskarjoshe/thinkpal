from app.agent.orchestator_tutor_agent import ai_tutor_agent
from app.config.logger_config import logger
from app.core.agent_open_router import fallback_ai_tutor_agent
from app.db.chat import create_chat_session
from app.db.chat import save_message
from sqlalchemy.orm import Session


def handle_chat_request(chat_id: str, query: str, db: Session, user_id: int):

    try:
        logger.info(f"{chat_id}: User Query: {query}")
        create_chat_session(db, chat_id, user_id=user_id, title=query)
        # raise Exception("Test Exception")
        response = ai_tutor_agent.run(query)
        logger.info(f"{chat_id}: LLM response: {response['content']}")
        save_message(db, chat_id, query, response)
        if (
            response.get("component_type") == "card"
            and response.get("title") == "Error"
        ):
            logger.warning(f"{chat_id}: Primary agent failed, using fallback.")
            response = fallback_ai_tutor_agent.run(query)
            logger.info(f"{chat_id}: Fallback LLM response: {response}")

        return chat_id, response

    except Exception as e:
        logger.exception(f"{chat_id}: Error in chat request: {e}")
        try:
            response = fallback_ai_tutor_agent.run(query)
            save_message(db, chat_id, query, response["content"])
            return chat_id, response
        except Exception as fallback_error:
            logger.exception(f"{chat_id}: Fallback also failed: {fallback_error}")
            return chat_id, {
                "component_type": "card",
                "title": "Error",
                "content": str(fallback_error),
                "features": [],
            }
