from app.agent.manager import agent_manager
from app.config.db_config import Base
from app.config.db_config import engine
from app.config.logger_config import logger
from app.config.openapi_config import custom_openapi
from app.routes import auth_routes
from app.routes import chat_routes
from app.routes import user_routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.on_event("startup")
async def startup_event():
    """Initialize agents when FastAPI starts"""
    logger.info("FastAPI startup: Initializing agents...")
    _ = agent_manager
    logger.info("FastAPI startup: Agents ready!")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown"""
    logger.info("FastAPI shutdown: Cleaning up agents...")


app.include_router(auth_routes.router, tags=["Auth"])
app.include_router(chat_routes.router, tags=["Chat"])
app.include_router(user_routes.router, tags=["User"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.openapi = lambda: custom_openapi(app)


@app.get("/")
def homepage():
    return {"Hello": "World"}
