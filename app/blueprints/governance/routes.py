from flask import Blueprint, jsonify, request, g
from app.extensions import db
from app.models import (
    AcquisitionAlert, AppointmentRequest, Complaint,
    GovernmentFund, LandReport, OfficeContact,
    PublicProject, Ward,
)
from app.services.ai_engine import classify_complaint, sentiment_score
from app.utils.security import login_required, log_audit

bp = Blueprint("governance", __name__)


# ── JSON API (React) ──────────────────────────────────────────────────────────

@bp.get("/wards")
def get_wards():
    wards = Ward.query.order_by(Ward.code).all()
    return jsonify([{
        "id": w.id,
        "code": w.code,
        "name_en": w.name_en,
        "name_ta": w.name_ta,
        "district": w.district,
    } for w in wards])


@bp.get("/funds")
def get_funds():
    funds = GovernmentFund.query.all()
    return jsonify([{
        "id": f.id,
        "project_id": f.project_id,
        "sanctioned_amount": float(f.sanctioned_amount or 0),
        "spent_amount": float(f.spent_amount or 0),
        "remaining": f.remaining,
        "contractor_name": f.contractor_name,
    } for f in funds])


@bp.get("/projects")
def get_projects():
    items = PublicProject.query.order_by(PublicProject.id.desc()).limit(50).all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "status": p.status.value if hasattr(p.status, "value") else str(p.status),
        "completion_percent": p.completion_percent or 0,
        "ward_id": p.ward_id,
        "timeline_start": p.timeline_start.isoformat() if p.timeline_start else None,
        "timeline_end_expected": p.timeline_end_expected.isoformat() if p.timeline_end_expected else None,
    } for p in items])


@bp.get("/complaints")
def get_complaints():
    items = Complaint.query.order_by(Complaint.created_at.desc()).limit(50).all()
    return jsonify([{
        "id": c.id,
        "title": c.title,
        "body": c.body,
        "ward_id": c.ward_id,
        "ai_category": c.ai_category,
        "sentiment_score": c.sentiment_score,
        "status": c.status.value if hasattr(c.status, "value") else str(c.status),
        "created_at": c.created_at.isoformat() if c.created_at else None,
    } for c in items])


@bp.post("/complaints")
def create_complaint():
    data = request.json or {}
    title = (data.get("title") or "").strip()
    body = (data.get("body") or "").strip()
    ward_id = data.get("ward_id")
    is_anon = data.get("anonymous", False)

    if not title or not body or not ward_id:
        return jsonify({"error": "Title, description and ward are required."}), 400

    user_id = (g.current_user.id if g.current_user and not is_anon else None)
    c = Complaint(
        user_id=user_id,
        ward_id=int(ward_id),
        title=title,
        body=body,
        is_anonymous=is_anon,
        sentiment_score=sentiment_score(body),
        ai_category=classify_complaint(body),
    )
    db.session.add(c)
    if user_id:
        log_audit(user_id, "complaint_create", f"complaint:{title[:40]}")
    db.session.commit()
    return jsonify({"message": "Complaint recorded.", "ai_category": c.ai_category}), 201


@bp.post("/land")
def create_land_report():
    data = request.json or {}
    description = (data.get("description") or "").strip()
    if not description:
        return jsonify({"error": "Description is required."}), 400

    user_id = g.current_user.id if g.current_user else None
    r = LandReport(
        user_id=user_id,
        survey_number=(data.get("survey_number") or "").strip() or None,
        report_type=(data.get("report_type") or "").strip() or None,
        description=description,
        lat=data.get("lat") or None,
        lng=data.get("lng") or None,
    )
    db.session.add(r)
    if user_id:
        log_audit(user_id, "land_report", r.survey_number or "no-survey")
    db.session.commit()
    return jsonify({"message": "Land protection report submitted."}), 201


@bp.post("/emergency")
def create_emergency():
    """Save a rescue/emergency request. No authentication required during disasters."""
    data = request.json or {}
    citizen_name = (data.get("citizen_name") or "").strip()
    contact_number = (data.get("contact_number") or "").strip()
    location = (data.get("location") or "").strip()
    description = (data.get("description") or "").strip()

    if not citizen_name or not contact_number or not location:
        return jsonify({"error": "Name, contact and location are required."}), 400

    # Log as an audit entry (no dedicated model needed for MVP)
    log_audit(None, "emergency_rescue_request", f"{citizen_name}:{location[:60]}")
    db.session.commit()
    return jsonify({"message": "Rescue request dispatched to emergency coordinators."}), 201


@bp.get("/wards/<int:ward_id>/dashboard")
def ward_dashboard(ward_id: int):
    ward = Ward.query.get_or_404(ward_id)
    alerts = (AcquisitionAlert.query.filter_by(ward_id=ward.id)
              .order_by(AcquisitionAlert.created_at.desc()).limit(10).all())
    complaints = (Complaint.query.filter_by(ward_id=ward.id)
                  .order_by(Complaint.created_at.desc()).limit(20).all())
    return jsonify({
        "ward": {
            "id": ward.id,
            "code": ward.code,
            "name_en": ward.name_en,
            "name_ta": ward.name_ta,
            "complaint_score": ward.complaint_score or 0,
            "development_score": ward.development_score or 0,
            "cleanliness_score": ward.cleanliness_score or 0,
            "happiness_index": ward.happiness_index or 0,
        },
        "alerts": [{
            "id": a.id,
            "title": a.title,
            "notice_text": a.notice_text,
            "effective_date": a.effective_date.isoformat() if a.effective_date else None,
        } for a in alerts],
        "complaints": [{
            "id": c.id,
            "title": c.title,
            "ai_category": c.ai_category,
            "sentiment_score": c.sentiment_score,
            "status": c.status.value if hasattr(c.status, "value") else str(c.status),
        } for c in complaints],
    })


@bp.get("/contact/<int:ward_id>")
def get_contact(ward_id: int):
    ward = Ward.query.get_or_404(ward_id)
    oc = OfficeContact.query.filter_by(ward_id=ward.id).first()
    return jsonify({
        "ward": {"id": ward.id, "name_en": ward.name_en},
        "contact": {
            "office_phone": oc.office_phone if oc else None,
            "emergency_phone": oc.emergency_phone if oc else None,
            "office_hours_en": oc.office_hours_en if oc else None,
        } if oc else None,
    })
