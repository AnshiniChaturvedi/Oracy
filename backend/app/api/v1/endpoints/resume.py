import logging
from zipfile import BadZipFile

import fitz
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from openai import AuthenticationError, NotFoundError, OpenAIError, RateLimitError
from starlette.concurrency import run_in_threadpool
from docx.opc.exceptions import PackageNotFoundError

from app.api.services.resume_parser import extract_resume_text
from app.api.services.resume_analyzer import (
    extract_skills,
    compare_role,
    suggest_roles,
)
from app.services.llm_resume_analyzer import (
    LLMConfigurationError,
    analyze_resume_with_llm,
    is_llm_configured,
)

router = APIRouter()
logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 5 * 1024 * 1024


@router.post("/analyze")
async def analyze_resume(
    target_role: str = Form(...),
    file: UploadFile = File(...),
):
    filename = file.filename or ""
    extension = filename.lower().rsplit(".", 1)[-1]

    if extension not in {"pdf", "docx"}:
        raise HTTPException(
            status_code=400,
            detail="Upload a PDF or DOCX resume.",
        )

    if not target_role.strip():
        raise HTTPException(
            status_code=400,
            detail="Target job role is required.",
        )

    content = await file.read(MAX_FILE_SIZE + 1)

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Resume must be 5 MB or smaller.",
        )

    try:
        resume_text = extract_resume_text(
            content,
            filename,
        )
    except (
        ValueError,
        fitz.FileDataError,
        BadZipFile,
        PackageNotFoundError,
    ) as exc:
        raise HTTPException(
            status_code=422,
            detail="Could not read this resume.",
        ) from exc

    if is_llm_configured():
        try:
            analysis = await run_in_threadpool(
                analyze_resume_with_llm,
                resume_text,
                target_role.strip(),
            )
        except LLMConfigurationError as exc:
            raise HTTPException(
                status_code=503,
                detail=str(exc),
            ) from exc
        except AuthenticationError as exc:
            logger.exception("AI authentication failed.")
            raise HTTPException(
                status_code=401,
                detail="Invalid AI API key. Please check LLM_API_KEY / GEMINI_API_KEY in backend/.env.",
            ) from exc
        except RateLimitError as exc:
            logger.exception("AI quota exceeded or rate limit hit.")
            raise HTTPException(
                status_code=429,
                detail="AI quota exceeded or rate limit hit (Error 429). Please check your account quota in your provider's console.",
            ) from exc
        except NotFoundError as exc:
            logger.exception("AI model not found.")
            raise HTTPException(
                status_code=404,
                detail=f"Requested AI model was not found (404). Please check the model name in backend/.env: {getattr(exc, 'message', str(exc))}",
            ) from exc
        except OpenAIError as exc:
            logger.exception("AI resume analysis request failed.")
            raise HTTPException(
                status_code=502,
                detail=f"Resume analysis service error: {getattr(exc, 'message', str(exc))}",
            ) from exc
        except ValueError as exc:
            raise HTTPException(
                status_code=422,
                detail=str(exc),
            ) from exc

        skills = [skill["name"] for skill in analysis["extracted_skills"]]
        comparison = {
            "supported_role": True,
            "target_role": target_role.strip(),
            "match_score": analysis["match_score"],
            "matched_skills": analysis["matched_requirements"],
            "missing_skills": analysis["missing_requirements"],
            "extracted_skills": skills,
        }
        suggested_roles = [
            {
                "role": suggestion["role"],
                "match_score": suggestion["match_score"],
                "matched_skills": suggestion["matching_skills"],
                "rationale": suggestion["rationale"],
            }
            for suggestion in analysis["suggested_roles"]
        ]
        return {
            "status": (
                "role_match"
                if analysis["match_score"] >= 60
                else "role_mismatch"
            ),
            "analysis_source": "llm",
            "resume_skills": skills,
            "comparison": comparison,
            "suggested_roles": suggested_roles,
            "llm_analysis": analysis,
        }

    skills = extract_skills(resume_text)

    if not skills:
        raise HTTPException(
            status_code=422,
            detail=(
                "No supported skills were detected. "
                "Check that the resume contains readable text."
            ),
        )

    comparison = compare_role(
        skills,
        target_role.strip(),
    )

    if not comparison["supported_role"]:
        raise HTTPException(
            status_code=422,
            detail=(
                "This role is not configured yet. "
                "Add its required skills first."
            ),
        )

    if comparison["match_score"] < 60:
        return {
            "status": "role_mismatch",
            "analysis_source": "rules",
            "resume_skills": skills,
            "comparison": comparison,
            "suggested_roles": suggest_roles(
                skills,
                target_role,
            ),
        }

    return {
        "status": "role_match",
        "analysis_source": "rules",
        "resume_skills": skills,
        "comparison": comparison,
        "suggested_roles": [],
    }
