from app.config.logger_config import logger
from app.config.security_config import get_current_user
from app.schemas.chat_schema import ChatRequest
from app.schemas.chat_schema import ChatResponse
from app.schemas.ui_schema import UIComponent
from app.services.chat_service import handle_chat_request
from fastapi import APIRouter
from fastapi import Depends

router = APIRouter(prefix="/api", dependencies=[Depends(get_current_user)])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    logger.info(f"Chat request received: {request.query}")

    chat_id, ui_response = handle_chat_request(request.chat_id, request.query)

    return ChatResponse(
        status="success",
        chat_id=chat_id,
        ui_component=UIComponent(**ui_response),
    )
