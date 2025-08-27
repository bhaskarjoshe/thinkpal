from app.config.db_config import get_db
from app.schemas.auth_schema import LoginRequest
from app.schemas.auth_schema import TokenResponse
from app.schemas.user_schema import UserCreate
from app.services.auth_service import login_user
from app.services.auth_service import signup_user
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/auth")


@router.post("/signup", response_model=TokenResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    return signup_user(user_data, db)


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(login_data.email, login_data.password, db)
