from typing import Dict
from typing import List
from typing import Literal
from typing import Optional
from typing import Union

from pydantic import BaseModel


class Subtopic(BaseModel):
    name: str
    description: str
    examples: Optional[List[str]] = []


class Topic(BaseModel):
    topic_name: str
    brief: str
    subtopics: List[Subtopic]
    resources: List[str]
    expected_outcome: str


class Level(BaseModel):
    level_name: Literal["Beginner", "Intermediate", "Advanced"]
    description: str
    topics: List[Topic]


class RoadmapContent(BaseModel):
    roadmap_type: Literal["structured"] = "structured"
    # Accept either dict of levels or a list of Level objects
    levels: Union[Dict[str, List[Dict]], List[Level]]


class Feature(BaseModel):
    label: str
    description: str


class RelatedTopic(BaseModel):
    label: str
    description: str


class SmartChoice(BaseModel):
    label: str
    action: str


class CodeSolution(BaseModel):
    code: Optional[str]
    explanation: str
    language: Optional[str] = "python"


class KnowledgeContent(BaseModel):
    features: List[Feature] = []
    next_topics_to_learn: List[RelatedTopic] = []
    smart_choices: Optional[List[SmartChoice]] = []
    next_teacher_prompt: Optional[str] = None


class QuizQuestion(BaseModel):
    question: str
    options: Optional[List[str]] = None
    answer: str
    explanation: str


class QuizContent(BaseModel):
    quiz_type: str
    questions: List[QuizQuestion]
    next_teacher_prompt: Optional[str] = None


class ExtraQuestion(BaseModel):
    question: str
    answer: str


class ForwardQuestion(BaseModel):
    title: str
    question: str


class UIComponent(BaseModel):
    component_type: Literal[
        "roadmap", "knowledge", "list", "quiz", "code", "visual", "text"
    ]
    title: str
    content: Optional[Union[str, List[str]]] = None
    content_text: Optional[str] = None
    content_json: Optional[
        Union[
            Dict,
            RoadmapContent,
            KnowledgeContent,
            QuizContent,
            List[Dict],
        ]
    ] = None
    image_url: Optional[str] = None
    features: List[Union[str, Feature]] = []
    related_topics: Optional[List[Union[str, RelatedTopic]]] = None
    brute_force_solution: Optional[CodeSolution] = None
    optimal_solution: Optional[CodeSolution] = None
    example_usage: Optional[str] = None
    children: Optional[List["UIComponent"]] = None
    extra_question: Optional[ExtraQuestion] = None
    extra_code_problems: Optional[List[ForwardQuestion]] = None


UIComponent.model_rebuild()
