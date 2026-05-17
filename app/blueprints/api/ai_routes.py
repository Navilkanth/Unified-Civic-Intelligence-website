from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Complaint, Ward
from app.services import ai_engine

bp = Blueprint("api_ai", __name__, url_prefix="/api/ai")


@bp.get("/ward/<int:ward_id>/summary")
def ward_summary(ward_id: int):
    ward = Ward.query.get_or_404(ward_id)
    bodies = [c.body for c in Complaint.query.filter_by(ward_id=ward.id).limit(50).all()]
    return jsonify(ai_engine.governance_insights_snippet(ward.name_en, bodies))


@bp.post("/classify-complaint")
def classify_complaint():
    text = (request.get_json(silent=True) or {}).get("text") or ""
    return jsonify({
        "sentiment": ai_engine.sentiment_score(text),
        "category": ai_engine.classify_complaint(text),
    })


@bp.post("/chat")
def chat():
    """AI Chatbot endpoint — used by React Chatbot page."""
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "Message is required."}), 400
    reply = ai_engine.chatbot_reply(message)
    return jsonify({"reply": reply})
