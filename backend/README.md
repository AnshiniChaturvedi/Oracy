# backend

FastAPI application: REST endpoints under `/api/v1`, validation, database access, orchestration, and application business logic.

The API currently provides `GET /api/v1/health` and MongoDB-backed `POST /api/v1/auth/signup` and `POST /api/v1/auth/login`. Set `MONGODB_URI` and `MONGODB_DB_NAME` in your environment; the defaults connect to a local MongoDB instance and use the `oracy_db` database. Other API areas remain planned (see `../docs/API_DESIGN.md`).

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
python -m pytest
```

Layering: `api` → `services` → `repositories` → `db`. `models` (DB) and `schemas` (API) stay separate. No heavy ML in request handlers.
