from typing import List
from typing import Optional
from typing import Union

from pydantic import BaseModel


class Subtopic(BaseModel):
    name: str
    description: str
    example: Optional[str] = None


class Topic(BaseModel):
    topic_name: str
    brief: str
    subtopics: List[Subtopic]
    resources: List[str]
    expected_outcome: str


class Level(BaseModel):
    level_name: str
    description: str
    topics: List[Topic]


class RoadmapContent(BaseModel):
    levels: List[Level]


class CodeSolution(BaseModel):
    code: str
    explanation: str


class UIComponent(BaseModel):
    component_type: str  # "card", "quiz", "roadmap", "code", "image", "text"
    title: str
    content: str
    content_text: Optional[str] = None
    content_json: Optional[Union[dict, RoadmapContent, list]] = None
    content_image: Optional[str] = None
    features: List[str] = []
    next_topics_to_learn: Optional[List[str]] = None
    brute_force_solution: Optional[CodeSolution] = None
    optimal_solution: Optional[CodeSolution] = None
    example_usage: Optional[str] = None
