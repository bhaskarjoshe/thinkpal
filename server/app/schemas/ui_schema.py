from typing import List

from pydantic import BaseModel

ui_schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "UI Component Schema",
    "type": "object",
    "properties": {
        "component_type": {
            "type": "string",
            "enum": ["card", "quiz", "list"],
            "description": "Type of UI component to display",
        },
        "title": {"type": "string", "description": "Title of the component"},
        "content": {
            "type": "string",
            "description": "Main content or body of the component",
        },
        "features": {
            "type": "array",
            "description": "Optional list of features or tags",
            "items": {"type": "string"},
        },
    },
    "required": ["component_type", "title", "content"],
    "additionalProperties": False,
}


class UIComponent(BaseModel):
    component_type: str
    title: str
    content: str
    features: List[str] = []
