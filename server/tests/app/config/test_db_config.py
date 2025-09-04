import types
import importlib


def test_db_config_builds_url_and_engine(monkeypatch):
    # Arrange environment for DB URL
    monkeypatch.setenv("POSTGRES_DB_NAME", "db")
    monkeypatch.setenv("POSTGRES_DB_USERNAME", "user")
    monkeypatch.setenv("POSTGRES_DB_PASSWORD", "pwd")
    monkeypatch.setenv("POSTGRES_DB_HOST", "host")
    monkeypatch.setenv("POSTGRES_DB_PORT", "15432")

    captured = {}

    def fake_create_engine(url):
        captured["url"] = url
        class DummyEngine:
            pass
        return DummyEngine()

    # Patch create_engine BEFORE reloading module
    import sqlalchemy
    monkeypatch.setattr(sqlalchemy, "create_engine", fake_create_engine)

    # Reload module to apply env and patched create_engine
    import app.config.db_config as db_config
    importlib.reload(db_config)

    assert isinstance(db_config, types.ModuleType)
    assert db_config.DATABASE_URL == "postgresql://user:pwd@host:15432/db"
    # Engine was created with the same URL
    assert captured["url"] == db_config.DATABASE_URL


def test_get_db_yields_and_closes(monkeypatch):
    # Create a fake session and factory to track calls
    class FakeSession:
        def __init__(self):
            self.closed = False
        def close(self):
            self.closed = True

    class FakeSessionLocal:
        def __call__(self):
            return FakeSession()

    import app.config.db_config as db_config
    # Ensure a fresh object and patch SessionLocal
    monkeypatch.setattr(db_config, "SessionLocal", FakeSessionLocal())

    gen = db_config.get_db()
    session = next(gen)
    assert isinstance(session, FakeSession)
    # Finalize generator to trigger close
    try:
        next(gen)
    except StopIteration:
        pass
    assert session.closed is True
