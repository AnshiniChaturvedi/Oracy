from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    """Liveness check only. Does not verify DB or ML components."""
    return {"status": "ok"}
