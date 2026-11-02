# backend

FastAPI application: REST endpoints under `/api/v1`, validation, database access, orchestration, and application business logic.

The API provides `GET /api/v1/health`, MongoDB-backed authentication, and `POST /api/v1/resumes/analyze` for PDF/DOCX resume analysis. Set `MONGODB_URI` and `MONGODB_DB_NAME` in your environment. The API requires a MongoDB URI; the database name defaults to `oracy_db`. Resume analysis uses the rules-based analyzer unless an OpenAI API key is configured; to enable AI analysis, set `LLM_API_KEY` (or `OPENAI_API_KEY`) and optionally `LLM_MODEL` in `backend\.env`. The default model is `gpt-4o-mini`.

From the `backend` directory in PowerShell, create a virtual environment and install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item ..\.env.example .env
```

Set `MONGODB_URI` in `backend\.env` to a working MongoDB connection string before starting the API. The application intentionally requires this setting and exits at startup when it is missing. For MongoDB Atlas, make sure the cluster is running and your current IP address is allowed in Atlas Network Access.

Then start the API:

```powershell
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; health and authentication routes are under `/api/v1`.
# backend

FastAPI application: REST endpoints under `/api/v1`, validation, database access, orchestration, and application business logic.

The API currently provides `GET /api/v1/health` and MongoDB-backed `POST /api/v1/auth/signup` and `POST /api/v1/auth/login`. Set `MONGODB_URI` and `MONGODB_DB_NAME` in your environment. The API requires a MongoDB URI; the database name defaults to `oracy_db`. Other API areas remain planned (see `../docs/API_DESIGN.md`).

From the `backend` directory in PowerShell, create a virtual environment and install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item ..\.env.example .env
```

Set `MONGODB_URI` in `backend\.env` to a working MongoDB connection string before starting the API. The application intentionally requires this setting and exits at startup when it is missing. For MongoDB Atlas, make sure the cluster is running and your current IP address is allowed in Atlas Network Access.

Then start the API:

```powershell
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; health and authentication routes are under `/api/v1`.
