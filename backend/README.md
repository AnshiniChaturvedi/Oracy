# backend

FastAPI application: REST endpoints under `/api/v1`, validation, database access, orchestration, and application business logic.

**Status:** skeleton only. `GET /api/v1/health` exists. Everything else is planned (see `../docs/API_DESIGN.md`).

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
python -m pytest
```

Layering: `api` → `services` → `repositories` → `db`. `models` (DB) and `schemas` (API) stay separate. No heavy ML in request handlers.
