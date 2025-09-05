from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    semester: int | None = None
    skills: list[str] | None = None
    interests: list[str] | None = None
    programming_languages: list[str] | None = None
    resume_data: dict | None = None
    resume_analysis: dict | None = None


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(UserResponse):
    semester: int | None = None
    skills: list[str] | None = None
    interests: list[str] | None = None
    programming_languages: list[str] | None = None
    resume_data: dict | None = None
    resume_analysis: dict | None = None

    model_config = ConfigDict(from_attributes=True)
