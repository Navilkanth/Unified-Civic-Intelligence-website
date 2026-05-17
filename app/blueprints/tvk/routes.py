from flask import Blueprint, request, jsonify, g

from app.extensions import db, socketio
from app.models import (
    Event, GamificationBadge, MembershipCard,
    NewsItem, PartyMemberComplaint, PartyComplaintStatus,
    Task, VolunteerProfile,
)
from app.utils.security import login_required, log_audit

bp = Blueprint("tvk", __name__)


# ── JSON API (React) ──────────────────────────────────────────────────────────

@bp.get("/news")
def api_news():
    items = NewsItem.query.order_by(NewsItem.created_at.desc()).limit(30).all()
    return jsonify([{
        "id": n.id,
        "title": n.title,
        "body": n.body,
        "district": n.district,
        "category": getattr(n, "category", None),
        "created_at": n.created_at.isoformat() if n.created_at else None,
    } for n in items])


@bp.get("/events")
def api_events():
    items = Event.query.order_by(Event.id.desc()).limit(30).all()
    return jsonify([{
        "id": e.id,
        "title": e.title,
        "description": getattr(e, "description", None),
        "event_date": e.event_date.isoformat() if getattr(e, "event_date", None) else None,
        "location": getattr(e, "location", None),
        "district": getattr(e, "district", None),
        "status": e.status.value if hasattr(getattr(e, "status", None), "value") else str(getattr(e, "status", "upcoming")),
    } for e in items])


@bp.get("/tasks")
def api_tasks():
    items = Task.query.order_by(Task.id.desc()).limit(50).all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": getattr(t, "description", None),
        "due_date": t.due_date.isoformat() if getattr(t, "due_date", None) else None,
        "status": t.status.value if hasattr(getattr(t, "status", None), "value") else str(getattr(t, "status", "pending")),
    } for t in items])


@bp.get("/gamification")
def api_gamification():
    profiles = VolunteerProfile.query.order_by(VolunteerProfile.points.desc()).limit(50).all()
    result = []
    for p in profiles:
        from app.models import User as UserModel
        user = db.session.get(UserModel, p.user_id)
        result.append({
            "id": p.id,
            "name": user.full_name if user else f"Volunteer #{p.id}",
            "district": p.district,
            "points": p.points or 0,
        })
    return jsonify(result)


@bp.post("/volunteer/register")
@login_required
def api_volunteer_register():
    data = request.json or {}
    district = (data.get("district") or "").strip()
    ward = (data.get("ward") or "").strip()
    booth = (data.get("booth") or "").strip()
    skills = (data.get("skills") or "").strip()
    availability = (data.get("availability") or "").strip()

    prof = VolunteerProfile.query.filter_by(user_id=g.current_user.id).first()
    if not prof:
        prof = VolunteerProfile(user_id=g.current_user.id)
        db.session.add(prof)
        db.session.flush()

    prof.district = district
    prof.ward_code = ward
    prof.booth = booth
    prof.skills = skills
    prof.availability = availability

    if not MembershipCard.query.filter_by(volunteer_id=prof.id).first():
        num = f"TVK-{g.current_user.id:06d}"
        db.session.add(MembershipCard(
            volunteer_id=prof.id,
            card_number=num,
            qr_payload=f"civic://tvk/member/{num}",
        ))
    db.session.commit()
    log_audit(g.current_user.id, "tvk_volunteer_profile", district)
    db.session.commit()
    return jsonify({"message": "Volunteer profile saved. Membership card issued."}), 201



