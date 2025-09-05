import tempfile

import docx2txt
import pdfplumber
from app.config.logger_config import logger
from app.models.user_model import User
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.agent.manager import agent_manager


def extract_text_from_resume(file: UploadFile) -> str:
    """
    Extracts raw text from resume files (.pdf, .docx, .txt).
    """
    try:
        filename = file.filename.lower()
        file.file.seek(0)

        if filename.endswith(".pdf"):
            logger.info("Extracting text from PDF resume")
            with pdfplumber.open(file.file) as pdf:
                return "\n".join([p.extract_text() or "" for p in pdf.pages])

        elif filename.endswith(".docx"):
            logger.info("Extracting text from DOCX resume")
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
                tmp.write(file.file.read())
                tmp.flush()
                text = docx2txt.process(tmp.name)
            return text

        elif filename.endswith(".txt"):
            logger.info("Extracting text from TXT resume")
            return file.file.read().decode("utf-8", errors="ignore")

        else:
            logger.warning(f"Unsupported file format: {filename}")
            return ""

    except Exception as e:
        logger.exception(f"Failed to extract text from resume: {e}")
        return ""


def analyze_resume(file: UploadFile, user: User, db: Session) -> dict:
    """
    Extract text and log it (no LLM call for now).
    """
    resume_text = extract_text_from_resume(file)
    logger.info("Resume text extracted successfully")
    user.resume_data = {"resume_data": resume_text}
    db.add(user)
    db.commit()
    db.refresh(user)

    if not resume_text.strip():
        return {"error": "No text extracted from resume"}

    query = f"__RESUME__{resume_text}"

    response = agent_manager.run_agent(query, [], user, "")

    logger.info(f"Resume analysis response: {response}")
    return response
