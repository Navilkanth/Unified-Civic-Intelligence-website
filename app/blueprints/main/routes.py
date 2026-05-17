from flask import Blueprint, jsonify

bp = Blueprint("main", __name__)


@bp.get("/")
def home():
    return jsonify({
        "status": "online",
        "service": "AI-Powered Civic Governance API Backend",
        "version": "1.0.0",
        "documentation": "Please refer to the Vercel React frontend for user interface access."
    })
