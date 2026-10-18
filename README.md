# 🎙️ Oracy

🌐 **Live Demo:** [https://oracy-nine.vercel.app/](https://oracy-nine.vercel.app/)

<h3 align="center">AI-Powered Multimodal Interview Preparation</h3>

<p align="center">
  Practice interviews, improve communication, and track your readiness with AI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square" alt="Project Status" />
  <img src="https://img.shields.io/badge/Next.js-Frontend-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-ML%20Engine-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
</p>

---

## ✨ Overview

**Oracy** is an AI-powered interview preparation platform designed to help candidates practice personalized interviews, improve communication, and assess interview readiness through multimodal analysis.

By combining natural language processing, speech analysis, and computer vision, Oracy aims to provide actionable feedback beyond traditional interview practice.

## 🚀 Features

- 📄 **Resume Analysis** — Extract skills, projects, and experience from candidate resumes.
- 🎯 **Personalized Questions** — Generate role-specific interview questions based on candidate profiles.
- 🔄 **Adaptive Interviews** — Ask relevant follow-up questions based on previous responses.
- 🧠 **Answer Evaluation** — Evaluate answers for relevance, structure, clarity, grammar, and completeness.
- 🎤 **Speech Analysis** — Analyze speaking rate, pauses, filler words, and fluency.
- 👁️ **Visual Analysis** — Estimate posture, gaze, movement, and camera framing.
- 📊 **Readiness Score** — Generate explainable scores based on interview practice performance.
- 💡 **AI Feedback** — Recommend personalized areas for improvement.
- 📈 **Progress Dashboard** — Track performance and improvement across practice sessions.

## 🛠️ Tech Stack

| Component | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| NLP & Machine Learning | spaCy, Sentence Transformers, scikit-learn |
| Speech Analysis | Whisper, librosa |
| Computer Vision | OpenCV, MediaPipe |
| Storage | Local Storage, AWS S3 abstraction |
| Infrastructure | Docker |

## 🏗️ Project Structure

```text
oracy/
├── frontend/          # Next.js application
├── backend/           # FastAPI backend
├── ml-engine/         # NLP, scoring, and feedback
├── speech-analysis/   # Audio processing and speech metrics
├── vision-engine/     # Computer vision and visual analysis
├── shared/            # Shared schemas and utilities
├── docs/              # Project documentation
├── scripts/           # Development and utility scripts
├── .env.example       # Example environment configuration
├── docker-compose.yml
├── Makefile
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Python
- Git
- Docker (optional, for containerized development)

### Clone the Repository

```bash
git clone https://github.com/AnshiniChaturvedi/Oracy.git
cd Oracy
```

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run the Backend

Follow the backend setup instructions and environment requirements before starting the FastAPI service. Backend dependencies and configuration may vary as development progresses.

> **Note:** Configure environment variables locally using `.env.example` as a reference. Never commit API keys, passwords, or other secrets to GitHub.

## 📍 Development Roadmap

- [ ] Frontend and database setup
- [ ] Resume parsing and personalized question generation
- [ ] NLP-based answer evaluation and adaptive interviews
- [ ] Speech analysis and fluency metrics
- [ ] Computer vision and visual presentation analysis
- [ ] Explainable readiness scoring and personalized feedback
- [ ] Progress dashboard and practice history
- [ ] Deployment and production configuration

## 📚 Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [API Design](docs/API_DESIGN.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [ML Pipeline](docs/ML_PIPELINE.md)
- [Development Guide](docs/DEVELOPMENT_GUIDE.md)

## 🔐 Privacy and Responsible AI

Oracy is designed to support interview practice and self-improvement. Speech and visual metrics should be interpreted as estimates rather than definitive judgments about a candidate.

- Feedback should focus on observable practice performance.
- Visual presentation metrics are estimates and should not be treated as measures of personality, competence, or employability.
- Sensitive data, credentials, and private recordings should be handled carefully.

## ⚠️ Project Status

Oracy is currently in **early development**. The repository structure, documentation, frontend prototype, and initial backend scaffolding are being developed. Resume processing, database integration, and AI analysis pipelines may be incomplete or under active development.

Features described in this README represent the project's intended capabilities and roadmap; not every feature is necessarily implemented yet.

---

<p align="center">
  <strong>🎙️ Oracy — Practice smarter. Interview better.</strong>
</p>
