import uuid
from fastapi.testclient import TestClient


class TestChatRoutes:
    """Test cases for chat endpoints."""

    def test_new_chat_success(self, monkeypatch, authenticated_client: TestClient):
        """Test creating a new chat session successfully."""

        def fake_handle_chat_request(chat_id, query, db, user):
            return str(chat_id), {
                "ui_components": [
                    {
                        "component_type": "knowledge",
                        "title": "T",
                        "content": "Hello",
                        "features": ["knowledge"],
                    }
                ]
            }

        # Patch the exact reference used in the router
        monkeypatch.setattr(
            "app.routes.chat_routes.handle_chat_request", fake_handle_chat_request
        )

        response = authenticated_client.post("/api/chat/new")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "chat_id" in data
        # Validate chat_id is a valid UUID
        uuid.UUID(data["chat_id"])
        assert isinstance(data["ui_components"], list)
        assert len(data["ui_components"]) == 1

    def test_chat_success_with_existing_id(self, monkeypatch, authenticated_client: TestClient):
        """Test sending a chat query with an existing chat_id."""

        existing_chat_id = uuid.uuid4()

        def fake_handle_chat_request(chat_id, query, db, user):
            assert str(existing_chat_id) == str(chat_id)
            return str(chat_id), {
                "ui_components": [
                    {
                        "component_type": "knowledge",
                        "title": "Reply",
                        "content": "OK",
                        "features": ["knowledge"]
                    }
                ]
            }

        # Patch the exact reference used in the router
        monkeypatch.setattr(
            "app.routes.chat_routes.handle_chat_request", fake_handle_chat_request
        )

        payload = {
            "chat_id": str(existing_chat_id),
            "chat_mode": "knowledge",
            "query": "Hi"
        }
        response = authenticated_client.post("/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["chat_id"] == str(existing_chat_id)
        assert isinstance(data["ui_components"], list)
        assert data["ui_components"][0]["title"] == "Reply"

    def test_chat_unauthorized_no_token(self, client: TestClient):
        """Test chat endpoint without authentication token."""
        payload = {
            "chat_id": str(uuid.uuid4()),
            "chat_mode": "knowledge",
            "query": "Hi",
        }
        response = client.post("/api/chat", json=payload)
        assert response.status_code == 401
        assert response.json() == {"detail": "Authorization header missing or invalid"}

    def test_chat_unauthorized_invalid_token(self, client: TestClient):
        """Test chat endpoint with invalid authentication token."""
        payload = {
            "chat_id": str(uuid.uuid4()),
            "chat_mode": "knowledge",
            "query": "Hi",
        }
        headers = {"Authorization": "Bearer invalidtoken"}
        response = client.post("/api/chat", json=payload, headers=headers)
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid or expired token"}

    def test_chat_validation_errors(self, authenticated_client: TestClient):
        """Missing required fields should trigger 422 validation errors."""
        # Missing query
        payload = {"chat_id": str(uuid.uuid4()), "chat_mode": "knowledge"}
        response = authenticated_client.post("/api/chat", json=payload)
        assert response.status_code == 422

        # Missing chat_mode
        payload = {"chat_id": str(uuid.uuid4()), "query": "Hello"}
        response = authenticated_client.post("/api/chat", json=payload)
        assert response.status_code == 422

    def test_chat_handler_error_path(self, monkeypatch, authenticated_client: TestClient):
        """If handler raises, response should still be success with error UI component prepared."""
        def boom(chat_id, query, db, user):
            raise RuntimeError("boom")

        # Patch exact symbol used by router
        monkeypatch.setattr("app.routes.chat_routes.handle_chat_request", boom)

        payload = {"chat_id": str(uuid.uuid4()), "chat_mode": "knowledge", "query": "Hi"}
        response = authenticated_client.post("/api/chat", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert isinstance(data["ui_components"], list)
        # Expect error UI component per service error path
        assert data["ui_components"][0]["title"] in ("Error", "Response")

    def test_chat_ui_component_shapes(self, monkeypatch, authenticated_client: TestClient):
        """Router should normalize different handler ui response shapes via prepare_ui_components."""
        # Return a single dict component without wrapper
        def handler1(chat_id, query, db, user):
            return str(chat_id), {"component_type": "knowledge", "title": "A", "content": "a", "features": ["knowledge"]}

        # Return list of components
        def handler2(chat_id, query, db, user):
            return str(chat_id), [
                {"component_type": "knowledge", "title": "B", "content": "b", "features": ["knowledge"]},
                {"component_type": "knowledge", "title": "C", "content": "c", "features": ["knowledge"]},
            ]

        # Return wrapped under ui_components
        def handler3(chat_id, query, db, user):
            return str(chat_id), {"ui_components": [
                {"component_type": "knowledge", "title": "D", "content": "d", "features": ["knowledge"]}
            ]}

        # Validate all three shapes
        for h in (handler1, handler2, handler3):
            monkeypatch.setattr("app.routes.chat_routes.handle_chat_request", h)
            payload = {"chat_id": str(uuid.uuid4()), "chat_mode": "knowledge", "query": "Hi"}
            response = authenticated_client.post("/api/chat", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            assert isinstance(data["ui_components"], list)
            assert len(data["ui_components"]) >= 1
