from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app.extensions import db
from app.models import User, UserRole
from app.utils.security import log_audit
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint("api_auth", __name__, url_prefix="/api/auth")


@bp.post("/login")
def api_login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role.value})
    log_audit(user.id, "api_login", "user", email)
    db.session.commit()
    return jsonify({"access_token": token, "role": user.role.value})


@bp.post("/register")
def api_register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()
    role_raw = (data.get("role") or "citizen").lower()
    if not email or not password or not full_name:
        return jsonify({"error": "email, password, full_name required"}), 400
    try:
        role = UserRole(role_raw)
    except ValueError:
        role = UserRole.CITIZEN
    if role == UserRole.ADMIN:
        return jsonify({"error": "Cannot self-register as admin"}), 403
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        full_name=full_name,
        role=role,
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "email": user.email, "role": user.role.value}), 201


@bp.get("/me")
@jwt_required()
def api_me():
    uid = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    return jsonify(
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "ward_id": user.ward_id,
        }
    )
