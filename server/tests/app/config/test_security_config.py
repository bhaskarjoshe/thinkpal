import pytest
from datetime import timedelta

from app.config.security_config import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)


class DummyRequest:
    def __init__(self, headers: dict):
        self.headers = headers


class TestSecurityConfig:
    def test_password_hash_and_verify(self):
        pw = "secret-password"
        hashed = get_password_hash(pw)
        assert hashed != pw
        assert verify_password(pw, hashed) is True
        assert verify_password("wrong", hashed) is False

    def test_create_access_token_and_get_current_user(self, db_session, created_user):
        token = create_access_token({"sub": str(created_user.id)}, expires_delta=timedelta(minutes=5))
        req = DummyRequest({"Authorization": f"Bearer {token}"})
        user = get_current_user(req, db_session)
        assert user.id == created_user.id

    def test_get_current_user_missing_header(self, db_session):
        req = DummyRequest({})
        with pytest.raises(Exception) as exc:
            get_current_user(req, db_session)
        assert getattr(exc.value, "status_code", None) == 401
        assert getattr(exc.value, "detail", "").startswith("Authorization header missing")

    def test_get_current_user_invalid_token(self, db_session):
        req = DummyRequest({"Authorization": "Bearer invalid.token"})
        with pytest.raises(Exception) as exc:
            get_current_user(req, db_session)
        assert getattr(exc.value, "status_code", None) == 401
        assert getattr(exc.value, "detail", "").startswith("Invalid or expired token")

    def test_get_current_user_user_not_found(self, db_session):
        # token for non-existent user id
        token = create_access_token({"sub": "9999999"})
        req = DummyRequest({"Authorization": f"Bearer {token}"})
        with pytest.raises(Exception) as exc:
            get_current_user(req, db_session)
        assert getattr(exc.value, "status_code", None) == 401
        assert getattr(exc.value, "detail", None) == "User not found"
