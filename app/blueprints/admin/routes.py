from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import (
    Complaint, Donation, PublicProject, User,
    VolunteerProfile, WelfareRequest, UserRole,
    CharityVolunteerActivity, ComplaintStatus
)
from app.models.charity import WelfareRequestStatus
from app.utils.security import login_required, roles_required, log_audit

bp = Blueprint("admin", __name__)


# ── JSON API (React) ──────────────────────────────────────────────────────────

@bp.get("/stats")
def api_stats():
    """JSON stats endpoint for React admin dashboard."""
    total_donations = sum(float(d.amount or 0) for d in Donation.query.all())
    active_projects = PublicProject.query.filter(
        PublicProject.status.in_(["active", "planned"])
    ).count()
    return jsonify({
        "total_users": User.query.count(),
        "total_complaints": Complaint.query.count(),
        "active_projects": active_projects,
        "welfare_requests": WelfareRequest.query.count(),
        "total_donations": total_donations,
        "volunteers": VolunteerProfile.query.count(),
    })


@bp.get("/complaints")
def api_complaints():
    items = Complaint.query.order_by(Complaint.created_at.desc()).all()
    return jsonify([{
        "id": c.id,
        "title": c.title,
        "body": c.body,
        "ward_name": c.ward.name_en if c.ward else "General",
        "ai_category": c.ai_category,
        "sentiment_score": c.sentiment_score,
        "status": c.status.value if hasattr(c.status, "value") else str(c.status),
        "created_at": c.created_at.isoformat() if c.created_at else None,
    } for c in items])


@bp.post("/complaints/<int:complaint_id>/status")
def update_complaint_status(complaint_id: int):
    data = request.json or {}
    new_status = (data.get("status") or "").strip().lower()
    
    c = Complaint.query.get_or_404(complaint_id)
    try:
        c.status = ComplaintStatus(new_status)
    except ValueError:
        return jsonify({"error": "Invalid status value."}), 400
        
    db.session.commit()
    return jsonify({"message": f"Complaint status successfully updated to {new_status}."})


@bp.get("/users")
def api_users():
    users = User.query.order_by(User.id.desc()).all()
    return jsonify([{
        "id": u.id,
        "email": u.email,
        "full_name": u.full_name,
        "phone": u.phone,
        "role": u.role.value if hasattr(u.role, "value") else str(u.role),
        "is_active": u.is_active,
        "created_at": u.created_at.isoformat() if u.created_at else None,
    } for u in users])


@bp.post("/users/<int:user_id>/status")
def update_user_status(user_id: int):
    data = request.json or {}
    
    u = User.query.get_or_404(user_id)
    if "is_active" in data:
        u.is_active = bool(data["is_active"])
    if "role" in data:
        new_role = data["role"].strip().lower()
        try:
            u.role = UserRole(new_role)
        except ValueError:
            return jsonify({"error": "Invalid role value."}), 400
            
    db.session.commit()
    return jsonify({"message": "User configuration successfully updated."})


@bp.get("/welfare")
def api_welfare():
    reqs = WelfareRequest.query.order_by(WelfareRequest.id.desc()).all()
    return jsonify([{
        "id": w.id,
        "user_name": w.user.full_name if w.user else "Anonymous Citizen",
        "request_type": w.request_type.value if hasattr(w.request_type, "value") else str(w.request_type),
        "narrative": w.narrative,
        "status": w.status.value if hasattr(w.status, "value") else str(w.status),
        "ai_scheme_suggestions": w.ai_scheme_suggestions,
        "created_at": w.created_at.isoformat() if w.created_at else None,
    } for w in reqs])


@bp.post("/welfare/<int:request_id>/status")
def update_welfare_status(request_id: int):
    data = request.json or {}
    new_status = (data.get("status") or "").strip().lower()
    
    wr = WelfareRequest.query.get_or_404(request_id)
    try:
        wr.status = WelfareRequestStatus(new_status)
    except ValueError:
        return jsonify({"error": "Invalid status value."}), 400
        
    db.session.commit()
    return jsonify({"message": f"Welfare request successfully {new_status}."})


@bp.get("/donations")
def api_donations():
    donations = Donation.query.order_by(Donation.id.desc()).all()
    return jsonify([{
        "id": d.id,
        "donor_name": d.donor.full_name if d.donor and not d.is_anonymous else "Anonymous",
        "campaign_name": d.campaign.name if d.campaign else "General",
        "amount": float(d.amount or 0),
        "ledger_ref": d.ledger_ref,
        "created_at": d.created_at.isoformat() if d.created_at else None,
    } for d in donations])


@bp.get("/activities")
def api_activities():
    from app.models.volunteer import Task
    charity_acts = CharityVolunteerActivity.query.order_by(CharityVolunteerActivity.id.desc()).all()
    tasks = Task.query.order_by(Task.id.desc()).all()
    
    return jsonify({
        "charity_activities": [{
            "id": c.id,
            "volunteer_name": c.volunteer.user.full_name if c.volunteer and c.volunteer.user else "Anonymous",
            "activity_type": c.activity_type,
            "hours": c.hours,
            "notes": c.notes,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        } for c in charity_acts],
        "tvk_tasks": [{
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "assignee_name": t.assignee.user.full_name if t.assignee and t.assignee.user else "Unassigned",
            "status": t.status.value if hasattr(t.status, "value") else str(t.status),
            "created_at": t.created_at.isoformat() if t.created_at else None,
        } for t in tasks]
    })



