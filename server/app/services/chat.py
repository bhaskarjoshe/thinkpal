import uuid

from app.config.logger import logger
from app.core.agent import ai_tutor_agent
from app.core.agent_open_router import fallback_ai_tutor_agent
from app.models.chat import chat_sessions


def handle_chat_request(chat_id: str, query: str):
    if not chat_id:
        chat_id = str(uuid.uuid4())
        chat_sessions[chat_id] = []
        logger.info(f"New chat started with ID: {chat_id}")

    try:
        logger.info(f"{chat_id}: User Query: {query}")
        raise Exception("Test Exception")
        response = ai_tutor_agent.run(query)
        logger.info(f"{chat_id}: LLM response: {response['content']}")

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
            logger.info(f"{chat_id}: Fallback LLM response: {response['content']}")
            return chat_id, response
        except Exception as fallback_error:
            logger.exception(f"{chat_id}: Fallback also failed: {fallback_error}")
            return chat_id, {
                "component_type": "card",
                "title": "Error",
                "content": str(fallback_error),
                "features": [],
            }
