from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_env: str = "development"
    log_level: str = "INFO"
    cors_allowed_origins: str = "http://localhost:3000"
    mongodb_uri: str
    mongodb_db_name: str = "oracy_db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
