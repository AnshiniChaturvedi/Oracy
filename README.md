# Oracy

**AI-Powered Multimodal Interview Preparation and Readiness Assessment System**

Oracy helps candidates prepare for interviews by combining resume understanding, personalized questions, and multimodal analysis of how they answer (content, speech, and on-camera presentation), then turning the results into an explainable readiness score and actionable feedback.

> **Status: early scaffolding.** Only the repository structure, documentation, and a minimal backend skeleton (`GET /api/v1/health`) exist. No ML pipeline, authentication, database migration, or UI page is implemented. A folder existing does not mean the feature works.

## Planned features

1. Resume upload and candidate profile extraction
2. Personalized interview questions based on resume and target role
3. Adaptive follow-up questions based on candidate responses
4. NLP-based answer evaluation (relevance, structure, grammar, completeness)
5. Speech analysis (speaking rate, pauses, filler words, hesitation, fluency)
6. Computer vision analysis (posture, gaze direction, movement, camera framing)
7. ML-based scoring (technical knowledge, answer quality, communication, presentation)
8. Explainable Interview Readiness Score
9. Personalized feedback and improvement recommendations
10. Dashboard for tracking performance across sessions

Facial, gaze, and presentation metrics are **estimates**, not measures of personality or employability.

## Technology stack

| Area | Technology |
|---|---|
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, REST (`/api/v1`) |
| Database | PostgreSQL |
| NLP | spaCy, Sentence Transformers, LLM API abstraction |
| Speech | Whisper, librosa |
| Vision | OpenCV, MediaPipe |
| ML | scikit-learn |
| Storage | Local (dev), S3 abstraction |
| Deployment | Docker (cloud config later) |
| Testing | pytest; frontend test setup TBD |

## Repository map

```
oracy/
├── frontend/          Next.js UI (to be scaffolded)
├── backend/           FastAPI app: REST, validation, DB, orchestration
├── ml-engine/         Resume parsing, question generation, evaluation, scoring, feedback
├── speech-analysis/   Transcription, audio features, fluency metrics
├── vision-engine/     Pose, gaze, movement, framing analysis
├── shared/            API contracts and schemas shared across components
├── docs/              Architecture and development documentation
├── scripts/           Developer utility scripts
├── .env.example       Placeholder environment variables
├── docker-compose.yml PostgreSQL for local development
└── Makefile           Common dev commands
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for details.

## Setup status

| Item | Status |
|---|---|
| Repository structure and docs | Done (initial) |
| Backend skeleton + health endpoint | Done (untested in scaffolding environment) |
| PostgreSQL via docker-compose | Config only |
| Frontend scaffold | Not started |
| Database models/migrations | Not started |
| ML, speech, vision modules | Not started |
| CI workflow, root Dockerfile | Not started |

## Roadmap

1. **Foundation:** frontend scaffold, DB models and migrations, CI.
2. **Resume and questions:** resume upload, parsing, question generation.
3. **Answer evaluation:** transcription, NLP evaluation, adaptive follow-ups.
4. **Multimodal:** speech fluency metrics, vision metrics.
5. **Scoring and feedback:** configurable explainable readiness score, feedback generation.
6. **Dashboard and hardening:** session history, background processing, security review, deployment.

## Documentation

[Project structure](docs/PROJECT_STRUCTURE.md) · [Architecture](docs/ARCHITECTURE.md) · [API design](docs/API_DESIGN.md) · [Database schema](docs/DATABASE_SCHEMA.md) · [ML pipeline](docs/ML_PIPELINE.md) · [Development guide](docs/DEVELOPMENT_GUIDE.md)
