from app.config.db_config import Base
from app.config.db_config import engine
from app.routes import auth_routes
from app.routes import chat_routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router, tags=["Auth"])
app.include_router(chat_routes.router, tags=["Chat"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def homepage():
    return {"Hello": "World"}
