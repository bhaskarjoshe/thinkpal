from app.config.logger_config import logger
from app.config.security_config import create_access_token
from app.config.security_config import get_password_hash
from app.config.security_config import verify_password
from app.models.user_model import User
from app.schemas.user_schema import UserCreate
from fastapi import HTTPException
from fastapi import status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


def signup_user(user_data: UserCreate, db: Session):
    try:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            logger.warning(f"Signup attempt with existing email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        hashed_pw = get_password_hash(user_data.password)
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            password=hashed_pw,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        access_token = create_access_token(data={"sub": str(new_user.id)})
        logger.info(f"New user created: {new_user.email}")

        return {
            "id": new_user.id,
            "message": "User created successfully",
            "token": access_token,
        }
    except HTTPException:
        raise

    except SQLAlchemyError as e:
        logger.error(f"Database error during signup: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.error(f"Unexpected error during signup: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


def login_user(email: str, password: str, db: Session):
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            logger.warning(f"Failed login attempt for email: {email}")
            raise HTTPException(status_code=401, detail="Invalid email or password")

        access_token = create_access_token(data={"sub": str(user.id)})
        logger.info(f"User logged in: {user.email}")

        return {"id": user.id, "message": "Login successful", "token": access_token}
    except HTTPException:
        raise

    except SQLAlchemyError as e:
        logger.error(f"Database error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


def get_user_profile(current_user: User):
    try:
        if not current_user:
            logger.warning("Unauthorized profile access attempt")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
            )

        logger.info(f"Profile retrieved for user: {current_user.email}")
        return current_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during profile fetch: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
