from app.config.security_config import get_current_user
from app.models.user_model import User
from app.schemas.user_schema import UserProfileResponse
from app.services.auth_service import get_user_profile
from fastapi import APIRouter
from fastapi import Depends

router = APIRouter(prefix="/api/user")


@router.get("/profile", response_model=UserProfileResponse)
def profile(
    current_user: User = Depends(get_current_user),
):
    return get_user_profile(current_user)
