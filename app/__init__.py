import os

from flask import Flask, g, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.extensions import cors, db, jwt, migrate, socketio
from app.models import User


def create_app(config_name: str | None = None) -> Flask:
    config_name = config_name or os.environ.get("FLASK_CONFIG", "development")
    from config import config_by_name

    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static",
        static_url_path="/static",
    )
    cfg = config_by_name.get(config_name, config_by_name["default"])
    app.config.from_object(cfg)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    # Use threading mode — no eventlet required
    socketio.init_app(
        app,
        async_mode="threading",
        cors_allowed_origins="*",
    )

    _register_blueprints(app)
    _register_cli(app)
    _register_socketio_handlers()

    @app.before_request
    def load_current_user():
        g.current_user = None
        try:
            verify_jwt_in_request(optional=True)
            ident = get_jwt_identity()
            if ident is not None:
                g.current_user = db.session.get(User, int(ident))
        except Exception:
            g.current_user = None

    @app.context_processor
    def inject_globals():
        return {"current_user": getattr(g, "current_user", None)}

    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "service": "unified-civic-intelligence"})

    @app.errorhandler(403)
    def forbidden(_e):
        return jsonify({"error": "Forbidden"}), 403

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "Not Found"}), 404

    @app.errorhandler(500)
    def handle_500(e):
        import traceback
        tb = traceback.format_exc()
        return jsonify({"error": "Internal Server Error", "traceback": tb}), 500

    return app


def _register_blueprints(app: Flask) -> None:
    from app.blueprints.admin.routes import bp as admin_bp
    from app.blueprints.auth.routes import bp as auth_bp
    from app.blueprints.charity.routes import bp as charity_bp
    from app.blueprints.governance.routes import bp as governance_bp
    from app.blueprints.main.routes import bp as main_bp
    from app.blueprints.tvk.routes import bp as tvk_bp
    from app.blueprints.api import register_api

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(governance_bp, url_prefix="/governance")
    app.register_blueprint(tvk_bp, url_prefix="/tvk")
    app.register_blueprint(charity_bp, url_prefix="/charity")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    register_api(app)


def _register_cli(app: Flask) -> None:
    from app import cli as cli_module
    cli_module.register(app)


def _register_socketio_handlers() -> None:
    @socketio.on("connect")
    def _connect():
        return True

    @socketio.on("join_ward")
    def _join_ward(data):
        from flask_socketio import join_room
        wid = (data or {}).get("ward_id")
        if wid is not None:
            join_room(f"ward_{wid}")
