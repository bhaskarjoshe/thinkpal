from datetime import datetime
from datetime import timezone
from uuid import uuid4

from app.config.logger_config import logger
from app.models.chat_model import ChatMessage
from app.models.chat_model import ChatSession
from sqlalchemy.orm import Session


def create_chat_session(
    db: Session, chat_id: str, user_id: int, title: str = None
) -> ChatSession:
    """Create a new chat session (only if not already exists)."""
    session = db.query(ChatSession).filter(ChatSession.id == chat_id).first()
    if session:
        return session

    new_session = ChatSession(
        id=chat_id,
        title=title or "New Chat",
        user_id=user_id,
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    logger.info(f"{chat_id}: Chat Session Created for the chat.")
    return new_session


def save_message(
    db: Session, session_id: str, query: str, response: str
) -> ChatMessage:
    """Save a new message (query + response) to the chat session."""
    new_message = ChatMessage(
        id=uuid4(),
        session_id=session_id,
        query=query,
        response=response,
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    logger.info(f"{session_id}: Message saved to the chat history.")
    return new_message


def get_chat_session(db: Session, chat_id: str) -> ChatSession:
    """Fetch chat session by ID."""
    return db.query(ChatSession).filter(ChatSession.id == chat_id).first()


def get_chat_history(db: Session, chat_id: str):
    """Fetch all messages for a chat session (ordered)."""
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == chat_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
