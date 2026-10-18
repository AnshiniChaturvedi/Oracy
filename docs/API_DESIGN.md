# API Design

All routes are versioned under `/api/v1`. JSON unless noted.

**Implemented:** `GET /api/v1/health`. **Everything else below is PROPOSED and not implemented.**

## Endpoint groups

| Group | Endpoint | Status |
|---|---|---|
| Health | `GET /health` | Implemented |
| Resumes | `POST /resumes` (multipart) | Proposed |
| Resumes | `GET /resumes/{id}` | Proposed |
| Profiles | `GET /profiles/{resume_id}` | Proposed |
| Sessions | `POST /sessions` | Proposed |
| Sessions | `GET /sessions/{id}` | Proposed |
| Questions | `GET /sessions/{id}/questions` | Proposed |
| Answers | `POST /sessions/{id}/answers` (multipart: text/audio/video) | Proposed |
| Answers | `GET /answers/{id}` | Proposed |
| Jobs | `GET /jobs/{id}` | Proposed |
| Results | `GET /sessions/{id}/readiness` | Proposed |
| Feedback | `GET /sessions/{id}/feedback` | Proposed |
| Dashboard | `GET /dashboard/summary`, `GET /dashboard/sessions` | Proposed |

Authentication is not designed yet. Once added, all routes except `/health` will require it.

## Conventions

- Errors: `{ "error": { "code": "invalid_file_type", "message": "...", "details": {} } }` with proper HTTP status.
- Long-running work returns `202 Accepted` with a job reference.
- Pagination: `?limit=&cursor=` on list routes.
- Timestamps: ISO 8601 UTC.
- Contract files live in `shared/api-contracts/`; Pydantic schemas in `backend/app/schemas/` must match.

## Example contracts (proposed)

### `POST /resumes`

Request: `multipart/form-data` with `file` (PDF/DOCX) and `target_role`.

Response `201`:
```json
{
  "id": "res_123",
  "status": "parsing",
  "job_id": "job_456"
}
```

### `POST /sessions`

```json
{ "resume_id": "res_123", "target_role": "Backend Engineer", "question_count": 5 }
```

Response `201`:
```json
{ "id": "ses_789", "status": "in_progress", "created_at": "2026-01-01T10:00:00Z" }
```

### `POST /sessions/{id}/answers`

Multipart: `question_id`, optional `answer_text`, optional `audio`, optional `video`.

Response `202`:
```json
{ "answer_id": "ans_1", "job_id": "job_457", "status": "queued" }
```

### `GET /jobs/{id}`

```json
{ "id": "job_457", "status": "succeeded", "result_ref": "/api/v1/answers/ans_1" }
```

### `GET /sessions/{id}/readiness`

```json
{
  "session_id": "ses_789",
  "readiness_score": 0.0,
  "scale": "0-100",
  "config_version": "example",
  "components": [
    { "name": "technical_knowledge", "score": 0.0, "weight": 0.0, "confidence": 0.0,
      "evidence": ["..."] }
  ],
  "disclaimer": "Presentation metrics are estimates and not measures of employability."
}
```
Values are placeholders; weights come from configuration and are not validated.
