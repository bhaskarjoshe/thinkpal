import uuid

from app.config.logger import logger
from app.core.agent import ai_tutor_agent
from app.models.chat import chat_sessions


def handle_chat_request(chat_id: str, query: str):
    if not chat_id:
        chat_id = str(uuid.uuid4())
        chat_sessions[chat_id] = []
        logger.info(f"New chat started with ID: {chat_id}")

    response = ai_tutor_agent.run(query)
    logger.info(f"{chat_id}: User Query: {query}")
    logger.info(f"{chat_id}: LLM response: {response}")
    return chat_id, response
