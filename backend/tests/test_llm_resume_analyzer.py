import asyncio
from io import BytesIO
from types import SimpleNamespace

import httpx
from openai import NotFoundError
import pytest
from starlette.datastructures import UploadFile

from app.api.v1.endpoints import resume as resume_endpoint
from app.services import llm_resume_analyzer


def _sample_analysis() -> llm_resume_analyzer.ResumeAnalysis:
    return llm_resume_analyzer.ResumeAnalysis(
        extracted_skills=[
            llm_resume_analyzer.ResumeSkill(
                name="Python",
                evidence="Built a Python data processing tool.",
            )
        ],
        relevant_projects=["Built a data processing tool."],
        experience_summary=["Developed data tools."],
        role_requirements=["Python programming"],
        matched_requirements=["Python programming"],
        missing_requirements=[],
        match_score=100,
        fit_rationale="The resume provides evidence of Python development.",
        suggested_roles=[
            llm_resume_analyzer.SuggestedRole(
                role="Data Analyst",
                rationale="The resume includes data processing work.",
                matching_skills=["Python"],
                match_score=80,
            )
        ],
    )


def test_analyze_resume_uses_configured_openai_model(monkeypatch):
    sample = _sample_analysis()
    captured: dict = {}

    def parse(**kwargs):
        captured.update(kwargs)
        return SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(refusal=None, parsed=sample)
                )
            ]
        )

    class FakeOpenAI:
        def __init__(self, **kwargs):
            captured["client"] = kwargs
            self.chat = SimpleNamespace(
                completions=SimpleNamespace(parse=parse)
            )

    monkeypatch.setenv("LLM_PROVIDER", "")
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    monkeypatch.setenv("LLM_MODEL", "test-model")
    monkeypatch.setattr(llm_resume_analyzer, "OpenAI", FakeOpenAI)

    result = llm_resume_analyzer.analyze_resume_with_llm(
        "Python resume text",
        "Python Developer",
    )

    assert result == sample.model_dump()
    assert captured["client"]["api_key"] == "test-key"
    assert captured["model"] == "test-model"
    assert captured["response_format"] is llm_resume_analyzer.ResumeAnalysis


def test_analyze_resume_supports_gemini_provider(monkeypatch):
    sample = _sample_analysis()
    captured: dict = {}

    def parse(**kwargs):
        captured.update(kwargs)
        return SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(refusal=None, parsed=sample)
                )
            ]
        )

    class FakeOpenAI:
        def __init__(self, **kwargs):
            captured["client"] = kwargs
            self.chat = SimpleNamespace(
                completions=SimpleNamespace(parse=parse)
            )

    monkeypatch.setenv("LLM_PROVIDER", "gemini")
    monkeypatch.delenv("LLM_API_KEY", raising=False)
    monkeypatch.delenv("LLM_MODEL", raising=False)
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setenv("GEMINI_MODEL", "gemini-2.5-flash")
    monkeypatch.setattr(llm_resume_analyzer, "OpenAI", FakeOpenAI)

    result = llm_resume_analyzer.analyze_resume_with_llm(
        "Python resume text",
        "Python Developer",
    )

    assert result == sample.model_dump()
    assert captured["client"]["api_key"] == "test-gemini-key"
    assert "generativelanguage.googleapis.com" in captured["client"]["base_url"]
    assert captured["model"] == "gemini-2.5-flash"


def test_analyze_resume_falls_back_when_model_not_found(monkeypatch):
    sample = _sample_analysis()
    tried_models: list[str] = []

    def parse(**kwargs):
        model = kwargs.get("model")
        tried_models.append(model)
        if model == "nonexistent-model":
            # Simulate a 404 NotFoundError from OpenAI / Gemini
            req = httpx.Request("POST", "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions")
            resp = httpx.Response(404, request=req)
            raise NotFoundError("Requested model nonexistent-model was not found", response=resp, body=None)
        return SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(refusal=None, parsed=sample)
                )
            ]
        )

    class FakeOpenAI:
        def __init__(self, **kwargs):
            self.chat = SimpleNamespace(
                completions=SimpleNamespace(parse=parse)
            )
            self.models = SimpleNamespace(list=lambda: [])

    monkeypatch.setenv("LLM_PROVIDER", "gemini")
    monkeypatch.delenv("LLM_API_KEY", raising=False)
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setenv("GEMINI_MODEL", "nonexistent-model")
    monkeypatch.setattr(llm_resume_analyzer, "OpenAI", FakeOpenAI)

    result = llm_resume_analyzer.analyze_resume_with_llm(
        "Python resume text",
        "Python Developer",
    )

    assert result == sample.model_dump()
    assert tried_models[0] == "nonexistent-model"
    assert "gemini-3.8-flash" in tried_models


def test_analyze_resume_requires_api_key(monkeypatch):
    monkeypatch.delenv("LLM_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)

    with pytest.raises(llm_resume_analyzer.LLMConfigurationError, match="is not configured"):
        llm_resume_analyzer.analyze_resume_with_llm(
            "Python resume text",
            "Python Developer",
        )


def test_analyze_resume_rejects_empty_resume():
    with pytest.raises(ValueError, match="Resume text is empty"):
        llm_resume_analyzer.analyze_resume_with_llm("", "Python Developer")


def test_resume_endpoint_returns_llm_analysis(monkeypatch):
    analysis = _sample_analysis().model_dump()
    monkeypatch.setattr(
        resume_endpoint,
        "extract_resume_text",
        lambda content, filename: "Synthetic resume text",
    )
    monkeypatch.setattr(resume_endpoint, "is_llm_configured", lambda: True)
    monkeypatch.setattr(
        resume_endpoint,
        "analyze_resume_with_llm",
        lambda resume_text, target_role: analysis,
    )

    async def fake_run_in_threadpool(func, *args, **kwargs):
        return func(*args, **kwargs)

    monkeypatch.setattr(resume_endpoint, "run_in_threadpool", fake_run_in_threadpool)

    upload = UploadFile(
        filename="resume.pdf",
        file=BytesIO(b"synthetic file data"),
    )

    async def fake_read(size=-1):
        return b"synthetic file data"

    upload.read = fake_read

    coro = resume_endpoint.analyze_resume(
        target_role="Python Developer",
        file=upload,
    )
    try:
        coro.send(None)
    except StopIteration as exc:
        response = exc.value

    assert response["analysis_source"] == "llm"
    assert response["comparison"]["match_score"] == 100
    assert response["suggested_roles"][0]["matched_skills"] == ["Python"]
