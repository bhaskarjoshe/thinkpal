from typing import List
from typing import Optional
from typing import Union

from pydantic import BaseModel

UI_Schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "UI Component Schema",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "component_type": {
                "type": "string",
                "enum": ["card", "quiz", "roadmap", "code", "image", "text"],
                "description": "Type of UI component to display",
            },
            "title": {"type": "string"},
            "content": {"type": "string"},
            "content_text": {"type": ["string", "null"]},
            "content_json": {"type": ["object", "array", "null"]},
            "content_image": {"type": ["string", "null"]},
            "features": {"type": "array", "items": {"type": "string"}},
            "next_topics_to_learn": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["component_type", "title", "content", "features"],
        "additionalProperties": False,
    },
}


class UIComponent(BaseModel):
    component_type: str
    title: str
    content: str
    content_text: Optional[str] = None
    content_json: Optional[Union[dict, list]] = None
    content_image: Optional[str] = None
    features: List[str] = []
    next_topics_to_learn: Optional[List[str]] = None
