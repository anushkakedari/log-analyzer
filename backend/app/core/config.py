from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    groq_api_key: str

    supabase_url: str
    supabase_key: str

    # allowed_origins: str = (
    #     "http://localhost:5173,"
    #     "http://127.0.0.1:5173,"
    #     "http://localhost:3000,"
    #     "http://127.0.0.1:3000"
    # )
    allowed_origins: str = (
        "http://localhost:5173,"
        "https://laudable-respect-production-f4f1.up.railway.app,"
        "https://log-analyzer-steel.vercel.app,"
        "https://log-analyzer-anushkakedaris-projects.vercel.app"
    )

    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()