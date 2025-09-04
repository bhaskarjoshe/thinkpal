from datetime import datetime
from datetime import timezone

from app.config.db_config import Base
from sqlalchemy import JSON
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(256), nullable=False)

    semester = Column(Integer, nullable=True)
    skills = Column(JSON, nullable=True)
    interests = Column(JSON, nullable=True)
    programming_languages = Column(JSON, nullable=True)

    resume_data = Column(JSONB, nullable=True)
    resume_analysis = Column(JSONB, nullable=True)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )

    chat_sessions = relationship("ChatSession", back_populates="user")
