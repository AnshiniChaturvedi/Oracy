# 🎙️ Oracy

<h3 align="center">AI-Powered Multimodal Interview Preparation</h3>

<p align="center">
  Practice interviews, improve communication, and track your readiness with AI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/Next.js-Frontend-black?style=flat-square&logo=next.js"/>
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi"/>
  <img src="https://img.shields.io/badge/Python-ML%20Engine-3776AB?style=flat-square&logo=python&logoColor=white"/>
</p>

---

## ✨ Overview

**Oracy** is an AI-powered interview preparation platform designed to help candidates practice personalized interviews and improve their performance through multimodal analysis.

## 🚀 Features

- 📄 **Resume Analysis** — Extract candidate skills, projects, and experience.
- 🎯 **Personalized Questions** — Generate role-specific interview questions.
- 🔄 **Adaptive Interviews** — Ask follow-up questions based on responses.
- 🧠 **Answer Evaluation** — Assess relevance, structure, grammar, and completeness.
- 🎤 **Speech Analysis** — Analyze speaking rate, pauses, filler words, and fluency.
- 👁️ **Visual Analysis** — Estimate posture, gaze, movement, and camera framing.
- 📊 **Readiness Score** — Provide explainable performance scores.
- 💡 **AI Feedback** — Recommend personalized improvements.
- 📈 **Progress Dashboard** — Track performance across practice sessions.

## 🛠️ Tech Stack

| Component | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| NLP & ML | spaCy, Sentence Transformers, scikit-learn |
| Speech | Whisper, librosa |
| Computer Vision | OpenCV, MediaPipe |
| Storage | Local Storage, AWS S3 abstraction |
| Infrastructure | Docker |

## 🏗️ Project Structure

```text
oracy/
├── frontend/          # Next.js application
├── backend/           # FastAPI backend
├── ml-engine/         # NLP, scoring, feedback
├── speech-analysis/   # Audio processing
├── vision-engine/     # Computer vision
├── shared/            # Shared schemas
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── .env.example
├── docker-compose.yml
├── Makefile
└── README.md
```

## 📍 Development Roadmap

- [ ] Frontend and database setup
- [ ] Resume parsing and question generation
- [ ] NLP answer evaluation and adaptive interviews
- [ ] Speech and visual analysis
- [ ] Readiness scoring and personalized feedback
- [ ] Progress dashboard and deployment

## 📚 Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Design](docs/API_DESIGN.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [ML Pipeline](docs/ML_PIPELINE.md)
- [Development Guide](docs/DEVELOPMENT_GUIDE.md)

## ⚠️ Project Status

Oracy is in its **early development stage**. The repository structure, documentation, and minimal backend health endpoint are scaffolded. The frontend, database migrations, and AI analysis pipelines are not yet implemented.

*Visual presentation metrics are estimates and should not be treated as measures of personality or employability.*

---

<p align="center">
  <strong>🎙️ Oracy — Practice smarter. Interview better.</strong>
</p>
