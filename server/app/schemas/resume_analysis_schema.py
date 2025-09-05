from typing import List
from typing import Optional

from pydantic import BaseModel


class EducationEntry(BaseModel):
    degree: str
    university: str
    graduation_year: Optional[int] = None
    cgpa: Optional[float] = None


class ProjectEntry(BaseModel):
    title: str
    description: str
    technologies: List[str]


class ResumeAnalysis(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None

    education: List[EducationEntry]
    technical_skills: List[str]
    projects: List[ProjectEntry]
    achievements: List[str]

    strengths: List[str]
    weaknesses: List[str]

    recommended_roles: List[str] = []
    recommended_internships: List[str] = []
