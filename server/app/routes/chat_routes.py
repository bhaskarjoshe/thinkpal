import uuid

from app.config.db_config import get_db
from app.config.logger_config import logger
from app.config.security_config import get_current_user
from app.schemas.chat_schema import ChatRequest
from app.schemas.chat_schema import ChatResponse
from app.services.chat_service import handle_chat_request
from app.utils.ui_component_preparer import prepare_ui_components
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api")


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"Chat request received: {request.query}")

    chat_id, ui_response = handle_chat_request(
        request.chat_id, request.query, db, current_user
    )

    return ChatResponse(
        status="success",
        chat_id=chat_id,
        ui_components=prepare_ui_components(ui_response),
    )


@router.post("/chat/new", response_model=ChatResponse)
def new_chat(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    chat_id = uuid.uuid4()

    chat_id, ui_response = handle_chat_request(
        str(chat_id), "__INIT__", db, current_user
    )

    return ChatResponse(
        status="success",
        chat_id=chat_id,
        ui_components=prepare_ui_components(ui_response),
    )
