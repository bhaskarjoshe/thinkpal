from app.config.logger import logger
from app.schemas.chat import ChatRequest
from app.schemas.chat import ChatResponse
from app.schemas.chat import UIComponent
from app.services.chat import handle_chat_request
from fastapi import APIRouter

router = APIRouter(prefix="/api")


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    logger.info(f"Chat request received: {request.query}")

    chat_id, ui_response = handle_chat_request(request.chat_id, request.query)

    return ChatResponse(
        status="success",
        chat_id=chat_id,
        ui_component=UIComponent(**ui_response),
    )
