import uuid
import pytest

from app.services.chat_service import (
    handle_chat_request,
    _format_response_to_ui_components,
    _convert_tool_responses_to_ui_components,
    _ensure_ui_component_defaults,
    _map_tool_to_component_type,
    _error_ui_component,
)


class TestChatService:
    """Unit tests for chat service functions using the test DB session and fixtures."""

    def test_handle_chat_request_success_list_components(
        self, monkeypatch, db_session, created_user
    ):
        chat_id = str(uuid.uuid4())

        # Collect calls for verification
        calls = {"create": [], "history": [], "save": []}

        def fake_create_chat_session(db, cid, user_id, title):
            calls["create"].append((cid, user_id, title))

        def fake_get_chat_history(db, cid):
            calls["history"].append(cid)
            return []

        def fake_serialize_chat_history(hist):
            # Return exactly what service expects to pass to agent
            return []

        def fake_run_agent(query, chat_history, user, cid):
            assert cid == chat_id
            assert user.id == created_user.id
            assert chat_history == []
            return [
                {
                    "component_type": "knowledge",
                    "title": "Reply",
                    "content": "OK",
                    "features": ["knowledge"],
                }
            ]

        def fake_save_message(db, cid, user_msg, assistant_msg):
            calls["save"].append((cid, user_msg, assistant_msg))

        # Patch in the service module namespace
        monkeypatch.setattr("app.services.chat_service.create_chat_session", fake_create_chat_session)
        monkeypatch.setattr("app.services.chat_service.get_chat_history", fake_get_chat_history)
        monkeypatch.setattr("app.services.chat_service.serialize_chat_history", fake_serialize_chat_history)
        monkeypatch.setattr("app.services.chat_service.agent_manager.run_agent", fake_run_agent)
        monkeypatch.setattr("app.services.chat_service.save_message", fake_save_message)

        returned_chat_id, payload = handle_chat_request(chat_id, "Hi", db_session, created_user)

        assert returned_chat_id == chat_id
        assert isinstance(payload, dict)
        assert "ui_components" in payload
        assert len(payload["ui_components"]) == 1
        assert payload["ui_components"][0]["title"] == "Reply"

        # Verify side-effects
        assert calls["create"] and calls["create"][0][0] == chat_id
        assert calls["history"] == [chat_id]
        # One save per UI component
        assert len(calls["save"]) == 1
        assert calls["save"][0][0] == chat_id and calls["save"][0][1] == "Hi"

    def test_handle_chat_request_success_wrapped_components(
        self, monkeypatch, db_session, created_user
    ):
        chat_id = str(uuid.uuid4())

        monkeypatch.setattr("app.services.chat_service.create_chat_session", lambda db, cid, user_id, title: None)
        monkeypatch.setattr("app.services.chat_service.get_chat_history", lambda db, cid: [])
        monkeypatch.setattr("app.services.chat_service.serialize_chat_history", lambda hist: [])

        def fake_run_agent(query, chat_history, user, cid):
            return {"ui_components": [
                {"component_type": "knowledge", "title": "A", "content": "a", "features": ["knowledge"]}
            ]}

        saved = []
        monkeypatch.setattr("app.services.chat_service.agent_manager.run_agent", fake_run_agent)
        monkeypatch.setattr("app.services.chat_service.save_message", lambda db, cid, u, a: saved.append((cid, u, a)))

        returned_chat_id, payload = handle_chat_request(chat_id, "Q", db_session, created_user)
        assert returned_chat_id == chat_id
        assert "ui_components" in payload and len(payload["ui_components"]) == 1
        assert saved and saved[0][0] == chat_id

    def test_handle_chat_request_error_path_saves_error(
        self, monkeypatch, db_session, created_user
    ):
        chat_id = str(uuid.uuid4())

        monkeypatch.setattr("app.services.chat_service.create_chat_session", lambda db, cid, user_id, title: None)
        monkeypatch.setattr("app.services.chat_service.get_chat_history", lambda db, cid: [])
        monkeypatch.setattr("app.services.chat_service.serialize_chat_history", lambda hist: [])

        def boom(query, chat_history, user, cid):
            raise RuntimeError("boom")

        saved = []
        monkeypatch.setattr("app.services.chat_service.agent_manager.run_agent", boom)
        monkeypatch.setattr("app.services.chat_service.save_message", lambda db, cid, u, a: saved.append((cid, u, a)))

        returned_chat_id, payload = handle_chat_request(chat_id, "Hi", db_session, created_user)
        assert returned_chat_id == chat_id
        assert "ui_components" in payload
        assert payload["ui_components"][0]["title"] == "Error"
        # Error text should be saved
        assert saved and saved[0][2] == "boom"

    # Helper behavior tests
    def test_format_response_to_ui_components_various(self):
        # dict with ui_components
        d = {"ui_components": [{"component_type": "knowledge", "title": "T", "content": "c", "features": ["knowledge"]}]}
        r = _format_response_to_ui_components(d)
        assert isinstance(r, list) and r[0]["title"] == "T"

        # dict without wrapper
        d2 = {"component_type": "knowledge", "title": "X", "content": "y", "features": ["knowledge"]}
        r2 = _format_response_to_ui_components(d2)
        assert isinstance(r2, list) and r2[0]["title"] == "X"

        # list passthrough
        lst = [{"component_type": "knowledge", "title": "L", "content": "z", "features": ["knowledge"]}]
        r3 = _format_response_to_ui_components(lst)
        assert r3 is lst

        # primitive fallback
        r4 = _format_response_to_ui_components("hello")
        assert isinstance(r4, list) and r4[0]["content"] == "hello"

    def test_convert_tool_responses_to_ui_components(self):
        tool_responses = [
            {"tool": "QuizAgent", "response": {"title": "Quiz", "content": "Q1"}},
            {"tool": "UnknownTool", "response": "raw"},
        ]
        comps = _convert_tool_responses_to_ui_components(tool_responses)
        assert len(comps) == 2
        # First should have defaults filled
        assert comps[0]["title"] == "Quiz" and comps[0]["component_type"] == "quiz"
        # Second mapped type should default to knowledge
        assert comps[1]["component_type"] == "knowledge" and comps[1]["content"] == "raw"

    def test_ensure_ui_component_defaults(self):
        ui = {"content": "c"}
        out = _ensure_ui_component_defaults(ui, "RoadmapAgent")
        assert out["component_type"] == "roadmap"
        assert out["title"].endswith("Response")
        assert out["features"] == ["roadmap"]

    @pytest.mark.parametrize(
        "tool,expected",
        [
            ("CodeAgent", "code"),
            ("QuizAgent", "quiz"),
            ("VisualLearningAgent", "visual"),
            ("RoadmapAgent", "roadmap"),
            ("KnowledgeAgent", "knowledge"),
            ("route_welcome_tool", "welcome"),
            ("route_query_tool", "query"),
            ("Unknown", "knowledge"),
        ],
    )
    def test_map_tool_to_component_type(self, tool, expected):
        assert _map_tool_to_component_type(tool) == expected

    def test_error_ui_component(self):
        payload = _error_ui_component("oops")
        assert "ui_components" in payload
        assert payload["ui_components"][0]["title"] == "Error"
        assert payload["ui_components"][0]["content"] == "oops"
