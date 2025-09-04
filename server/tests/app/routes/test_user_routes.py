from fastapi.testclient import TestClient
from app.config.security_config import create_access_token


class TestUserRoutes:
    """Test cases for the user API routes."""

    def test_get_profile_success(self, authenticated_client: TestClient, sample_user_data):
        response = authenticated_client.get("/api/user/profile")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == sample_user_data["email"]
        assert data["name"] == sample_user_data["name"]
        assert isinstance(data["id"], int)
        # Optional profile fields should be present (can be null or lists as provided)
        assert "semester" in data
        assert "skills" in data
        assert "interests" in data
        assert "programming_languages" in data

    def test_get_profile_no_token(self, client: TestClient):
        response = client.get("/api/user/profile")
        assert response.status_code == 401
        assert response.json() == {"detail": "Authorization header missing or invalid"}

    def test_get_profile_invalid_token(self, client: TestClient):
        headers = {"Authorization": "Bearer invalidtoken"}
        response = client.get("/api/user/profile", headers=headers)
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid or expired token"}

    def test_get_profile_user_not_found(self, client: TestClient):
        # Generate a token with a non-existent user id
        token = create_access_token(data={"sub": "999999"})
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/user/profile", headers=headers)
        assert response.status_code == 401
        assert response.json() == {"detail": "User not found"}

    def test_get_profile_with_minimal_user(self, db_session, client: TestClient):
        """Profile returns nullable fields when not set."""
        # Create a bare user
        from app.models.user_model import User
        from app.config.security_config import get_password_hash

        user = User(name="Bare", email="bare@example.com", password=get_password_hash("x"))
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        token = create_access_token(data={"sub": str(user.id)})
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/user/profile", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "bare@example.com"
        assert data.get("semester") is None


