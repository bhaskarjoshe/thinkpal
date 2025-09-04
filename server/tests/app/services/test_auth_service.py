import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate
from app.services.auth_service import signup_user, login_user, get_user_profile


class TestAuthService:
    """Unit tests for auth service functions using the test DB session."""

    # signup_user
    def test_signup_user_success(self, db_session: Session, sample_user_create: UserCreate):
        result = signup_user(sample_user_create, db_session)
        assert isinstance(result, dict)
        assert result["message"] == "User created successfully"
        assert "token" in result
        assert "id" in result

    def test_signup_user_duplicate_email(
        self, db_session: Session, created_user, sample_user_create: UserCreate
    ):
        # same email as created_user in fixture
        with pytest.raises(HTTPException) as exc:
            signup_user(sample_user_create, db_session)
        assert exc.value.status_code == 400
        assert exc.value.detail == "Email already registered"

    def test_signup_user_optional_fields(self, db_session: Session):
        # Only required fields
        payload = UserCreate(name="Opt", email="opt2@example.com", password="secret")
        result = signup_user(payload, db_session)
        assert result["message"] == "User created successfully"
        assert "token" in result

    # login_user
    def test_login_user_success(self, db_session: Session, created_user, login_data):
        result = login_user(login_data["email"], login_data["password"], db_session)
        assert result["message"] == "Login successful"
        assert "token" in result
        assert result["id"] == created_user.id

    def test_login_user_invalid_password(self, db_session: Session, created_user, login_data):
        with pytest.raises(HTTPException) as exc:
            login_user(login_data["email"], "wrongpassword", db_session)
        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid email or password"

    def test_login_user_nonexistent_email(self, db_session: Session, login_data):
        with pytest.raises(HTTPException) as exc:
            login_user("nonexistent@example.com", login_data["password"], db_session)
        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid email or password"

    # get_user_profile
    def test_get_user_profile_success(self, created_user):
        user = get_user_profile(created_user)
        # Should return the same user object
        assert user.id == created_user.id
        assert user.email == created_user.email

    def test_get_user_profile_unauthenticated(self):
        with pytest.raises(HTTPException) as exc:
            get_user_profile(None)
        assert exc.value.status_code == 401
        assert exc.value.detail == "Not authenticated"
