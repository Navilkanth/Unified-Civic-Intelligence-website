from flask import Blueprint

from app.blueprints.api.ai_routes import bp as ai_bp
from app.blueprints.api.auth import bp as auth_bp

api_bp = Blueprint("api", __name__, url_prefix="/api")


def register_api(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(ai_bp)
