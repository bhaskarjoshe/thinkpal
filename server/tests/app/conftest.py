import os

import pytest
from app.config.db_config import Base
from app.config.db_config import get_db
from app.config.security_config import create_access_token
from app.config.security_config import get_password_hash
from app.main import app
from app.models.user_model import User
from app.schemas.user_schema import UserCreate
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker

# PostgreSQL test database URL
POSTGRES_USER = os.environ.get("POSTGRES_TEST_DB_USERNAME", "test_user")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_TEST_DB_PASSWORD", "test_password")
POSTGRES_DB = os.environ.get("POSTGRES_TEST_DB_NAME", "test_db")
POSTGRES_HOST = os.environ.get("POSTGRES_TEST_DB_HOST", "localhost")
POSTGRES_PORT = os.environ.get("POSTGRES_TEST_DB_PORT", "5432")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    # Create all tables before each test
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after each test to keep the DB clean
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-jwt")
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_user_data():
    return {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "semester": 1,
        "skills": ["python"],
        "interests": ["ai"],
        "programming_languages": ["python", "ts"],
    }


@pytest.fixture
def sample_user_create(sample_user_data):
    return UserCreate(**sample_user_data)


@pytest.fixture
def created_user(db_session: Session, sample_user_data):
    hashed_password = get_password_hash(sample_user_data["password"])
    user = User(
        name=sample_user_data["name"],
        email=sample_user_data["email"],
        password=hashed_password,
        semester=sample_user_data.get("semester"),
        skills=sample_user_data.get("skills"),
        interests=sample_user_data.get("interests"),
        programming_languages=sample_user_data.get("programming_languages"),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def auth_token(created_user):
    return create_access_token(data={"sub": str(created_user.id)})


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def authenticated_client(client: TestClient, auth_headers):
    client.headers.update(auth_headers)
    return client


@pytest.fixture
def invalid_user_data():
    return {
        "name": "",
        "email": "invalid-email",
        "password": "123",
    }


@pytest.fixture
def duplicate_email_data(sample_user_data):
    return {
        **sample_user_data,
        "name": "Another User",
        "email": sample_user_data["email"],
    }


@pytest.fixture
def login_data():
    return {"email": "test@example.com", "password": "testpassword123"}


@pytest.fixture
def invalid_login_data():
    return {"email": "test@example.com", "password": "wrongpassword"}


@pytest.fixture(autouse=True)
def setup_test_env():
    os.environ.setdefault("POSTGRES_TEST_DB_NAME", "test_db")
    os.environ.setdefault("POSTGRES_TEST_DB_USERNAME", "test_user")
    os.environ.setdefault("POSTGRES_TEST_DB_PASSWORD", "test_password")
    os.environ.setdefault("POSTGRES_TEST_DB_HOST", "localhost")
    os.environ.setdefault("POSTGRES_TEST_DB_PORT", "5432")
    os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-jwt")
    yield
