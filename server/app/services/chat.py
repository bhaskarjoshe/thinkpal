import uuid
from app.models.chat import chat_sessions
from app.core.agent import ai_tutor_agent
from app.config.logger import logger


def start_new_chat() -> str:
    chat_id = str(uuid.uuid4())
    chat_sessions[chat_id] = []
    return chat_id


def save_message(chat_id: str, role: str, message: str):
    chat_sessions[chat_id].append({
        "role": role,
        "message": message
    })


def get_history(chat_id: str):
    return chat_sessions.get(chat_id, [])


def handle_chat_request(chat_id: str, query: str):
    if not chat_id:
        chat_id = start_new_chat()
        logger.info(f"New chat started with ID: {chat_id}")

    save_message(chat_id, "user", query)

    response = ai_tutor_agent.run(query)
    logger.info(f"{chat_id}: LLM response: {response}")

    save_message(chat_id, "ai", response)
    logger.info(f"{chat_id}: Saved LLM response")
    return chat_id, response
