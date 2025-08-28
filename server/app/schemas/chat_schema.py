from datetime import datetime
from typing import List
from typing import Optional
from uuid import UUID

from app.schemas.ui_schema import UIComponent
from pydantic import BaseModel


class ChatRequest(BaseModel):
    chat_id: Optional[UUID] = None
    chat_mode: str
    query: str


class ChatMessageResponse(BaseModel):
    id: UUID
    query: str
    response: str
    created_at: datetime


class ChatSessionResponse(BaseModel):
    id: UUID
    title: Optional[str]
    messages: List[ChatMessageResponse] = []
    created_at: datetime


class ChatResponse(BaseModel):
    status: str
    chat_id: UUID
    ui_component: UIComponent
    messages: Optional[List[ChatMessageResponse]] = None
