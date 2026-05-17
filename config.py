import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get(
        "SECRET_KEY", "dev-only-change-me-use-32plus-chars-in-prod-xx"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or os.environ.get(
        "SECRET_KEY", "dev-only-change-me-use-32plus-chars-in-prod-xx"
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    JWT_TOKEN_LOCATION = ("headers", "cookies")
    JWT_COOKIE_SECURE = os.environ.get("FLASK_ENV") == "production"
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_COOKIE_SAMESITE = "Lax"
    SOCKETIO_MESSAGE_QUEUE = os.environ.get("REDIS_URL")


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///civic_platform.db",
    )


class ProductionConfig(Config):
    DEBUG = False
    _db_url = os.environ.get("DATABASE_URL", "").strip()
    SQLALCHEMY_DATABASE_URI = _db_url or "sqlite:///civic_prod.db"


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
