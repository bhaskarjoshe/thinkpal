from app.config.db_config import get_db
from app.config.security_config import get_current_user
from app.services.document_service import analyze_resume
from fastapi import APIRouter
from fastapi import Depends
from fastapi import UploadFile
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/document", tags=["Document"])


@router.post("/upload_resume")
async def upload_resume(
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = analyze_resume(file, current_user, db)
    return {"status": "success", "data": result}
