from pydantic import BaseModel
from pydantic import ConfigDict


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    password: str
    semester: int | None = None
    skills: list[str] | None = None
    interests: list[str] | None = None
    programming_languages: list[str] | None = None


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(UserResponse):
    semester: int | None = None
    skills: list[str] | None = None
    interests: list[str] | None = None
    programming_languages: list[str] | None = None

    model_config = ConfigDict(from_attributes=True)
