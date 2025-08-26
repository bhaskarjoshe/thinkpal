from typing import List
from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    chat_id: Optional[str] = None
    query: str


class UIComponent(BaseModel):
    component_type: str
    title: str
    content: str
    features: List[str] = []


class ChatResponse(BaseModel):
    status: str
    chat_id: str
    ui_component: UIComponent
