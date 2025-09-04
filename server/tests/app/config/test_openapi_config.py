from fastapi import FastAPI
from fastapi import APIRouter

from app.config.openapi_config import custom_openapi


def test_custom_openapi_adds_bearer_security_to_non_auth_paths():
    app = FastAPI()

    router = APIRouter()

    @router.post("/api/auth/login")
    def login():
        return {"ok": True}

    @router.post("/api/auth/signup")
    def signup():
        return {"ok": True}

    @router.get("/api/secure")
    def secure():
        return {"ok": True}

    @router.get("/api/also-secure")
    def also_secure():
        return {"ok": True}

    app.include_router(router)

    schema = custom_openapi(app)

    # Security scheme present
    assert "components" in schema
    assert "securitySchemes" in schema["components"]
    assert "BearerAuth" in schema["components"]["securitySchemes"]

    # Auth endpoints should not have security requirement
    assert "security" not in schema["paths"]["/api/auth/login"]["post"]
    assert "security" not in schema["paths"]["/api/auth/signup"]["post"]

    # Other endpoints should have security requirement
    assert schema["paths"]["/api/secure"]["get"]["security"] == [{"BearerAuth": []}]
    assert schema["paths"]["/api/also-secure"]["get"]["security"] == [{"BearerAuth": []}]
