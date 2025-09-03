from typing import Dict
from typing import List
from typing import Optional
from typing import Union

from pydantic import BaseModel


class Feature(BaseModel):
    label: str
    description: str


class RelatedTopic(BaseModel):
    label: str
    description: str


class SmartChoice(BaseModel):
    label: str
    action: str


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
    component_type: str
    title: str
    content: Union[str, List[str]]
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

    extra_question: ExtraQuestion = ExtraQuestion(question="", answer="")
    extra_code_problems: List[ForwardQuestion] = [
        ForwardQuestion(title="", question=""),
        ForwardQuestion(title="", question=""),
    ]


UIComponent.model_rebuild()
