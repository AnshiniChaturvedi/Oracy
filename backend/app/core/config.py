from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_ENV = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_env: str = "development"
    log_level: str = "INFO"
    cors_allowed_origins: str = "http://localhost:3000"
    mongodb_uri: str
    mongodb_db_name: str = "oracy_db"

    model_config = SettingsConfigDict(
        env_file=(".env", str(_BACKEND_ENV)),
        extra="ignore",
    )


settings = Settings()
