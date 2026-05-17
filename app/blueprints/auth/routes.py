from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.models import User, UserRole
from app.utils.security import log_audit

bp = Blueprint("auth", __name__)


# ── JSON API (used by React) ──────────────────────────────────────────────────

@bp.post("/api/login")
def api_login():
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password."}), 401
    token = create_access_token(identity=str(user.id))
    log_audit(user.id, "api_login", "user", email)
    db.session.commit()
    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "phone": user.phone,
        }
    })


@bp.post("/api/register")
def api_register():
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()
    phone = (data.get("phone") or "").strip()
    role_raw = (data.get("role") or "citizen").lower()

    if not email or not password or not full_name:
        return jsonify({"error": "Email, password and full name are required."}), 400
    try:
        role = UserRole(role_raw)
    except ValueError:
        role = UserRole.CITIZEN
    if role == UserRole.ADMIN:
        return jsonify({"error": "Admin accounts are provisioned separately."}), 403
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered."}), 409

    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        full_name=full_name,
        phone=phone or None,
        role=role,
    )
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
        }
    }), 201



