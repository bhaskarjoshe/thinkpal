from fastapi.testclient import TestClient


class TestAuthRoutes:
    """Test cases for the authentication API routes."""

    def test_signup_success(self, client: TestClient, sample_user_data):
        """Test successful user signup via the /signup endpoint."""
        response = client.post("/api/auth/signup", json=sample_user_data)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["message"] == "User created successfully"

    def test_signup_duplicate_email(
        self, client: TestClient, created_user, sample_user_data
    ):
        """Test signup with a duplicate email should fail."""
        response = client.post("/api/auth/signup", json=sample_user_data)
        assert response.status_code == 400
        assert response.json() == {"detail": "Email already registered"}

    def test_signup_invalid_data(self, client: TestClient, invalid_user_data):
        """Test signup with invalid data should return a 422 validation error."""
        response = client.post("/api/auth/signup", json=invalid_user_data)
        assert response.status_code == 422  # Unprocessable Entity

    def test_login_success(self, client: TestClient, created_user, login_data):
        """Test successful login with valid credentials."""
        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["message"] == "Login successful"

    def test_login_invalid_password(self, client: TestClient, created_user, login_data):
        """Test login with an incorrect password should fail."""
        invalid_data = login_data.copy()
        invalid_data["password"] = "wrongpassword"
        response = client.post("/api/auth/login", json=invalid_data)
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid email or password"}

    def test_login_nonexistent_email(self, client: TestClient, login_data):
        """Test login with a non-existent email should fail."""
        invalid_data = login_data.copy()
        invalid_data["email"] = "nonexistent@example.com"
        response = client.post("/api/auth/login", json=invalid_data)
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid email or password"}

    def test_signup_missing_required_fields(self, client: TestClient):
        """Missing required fields should yield 422 validation error."""
        # Missing email
        payload = {"name": "N", "password": "p@ss"}
        response = client.post("/api/auth/signup", json=payload)
        assert response.status_code == 422

        # Missing password
        payload = {"name": "N", "email": "x@example.com"}
        response = client.post("/api/auth/signup", json=payload)
        assert response.status_code == 422

    def test_login_missing_required_fields(self, client: TestClient):
        """Missing required fields on login should yield 422."""
        # Missing email
        response = client.post("/api/auth/login", json={"password": "abc"})
        assert response.status_code == 422

        # Missing password
        response = client.post("/api/auth/login", json={"email": "x@example.com"})
        assert response.status_code == 422

    def test_signup_optional_fields_handled(self, client: TestClient):
        """Signup should work without optional profile fields."""
        payload = {"name": "Opt", "email": "opt@example.com", "password": "secret"}
        response = client.post("/api/auth/signup", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data and data["message"] == "User created successfully"

