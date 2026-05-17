from flask import Blueprint, request, jsonify, g, flash, redirect, render_template, url_for

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


# ── Legacy HTML routes ────────────────────────────────────────────────────────

@bp.get("/")
def hub():
    news = NewsItem.query.order_by(NewsItem.created_at.desc()).limit(12).all()
    return render_template("tvk/hub.html", news=news)


@bp.get("/html/events")
def events():
    return render_template("tvk/events.html")


@bp.get("/html/tasks")
def tasks():
    return render_template("tvk/tasks.html")


@bp.get("/html/gamification")
def gamification():
    return render_template("tvk/gamification.html")


@bp.route("/register", methods=["GET", "POST"])
@login_required
def volunteer_register():
    if request.method == "POST":
        district = (request.form.get("district") or "").strip()
        ward_code = (request.form.get("ward_code") or "").strip()
        booth = (request.form.get("booth") or "").strip()
        skills = (request.form.get("skills") or "").strip()
        availability = (request.form.get("availability") or "").strip()
        prof = VolunteerProfile.query.filter_by(user_id=g.current_user.id).first()
        if not prof:
            prof = VolunteerProfile(user_id=g.current_user.id)
            db.session.add(prof)
            db.session.flush()
        prof.district = district
        prof.ward_code = ward_code
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
        flash("Volunteer profile saved. Membership card issued.", "success")
        return redirect(url_for("tvk.membership"))
    prof = VolunteerProfile.query.filter_by(user_id=g.current_user.id).first()
    return render_template("tvk/volunteer_register.html", profile=prof)


@bp.get("/membership")
@login_required
def membership():
    prof = VolunteerProfile.query.filter_by(user_id=g.current_user.id).first()
    if not prof:
        flash("Complete volunteer registration to view your membership card.", "error")
        return redirect(url_for("tvk.volunteer_register"))
    card = MembershipCard.query.filter_by(volunteer_id=prof.id).first()
    badges = GamificationBadge.query.filter_by(volunteer_id=prof.id).all()
    return render_template("tvk/membership.html", profile=prof, card=card, badges=badges)


@bp.route("/party-complaint", methods=["GET", "POST"])
@login_required
def party_complaint():
    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        body = (request.form.get("body") or "").strip()
        if not title or not body:
            flash("Title and narrative required.", "error")
            return render_template("tvk/party_complaint.html")
        db.session.add(PartyMemberComplaint(
            reporter_id=g.current_user.id,
            title=title,
            body=body,
            status=PartyComplaintStatus.SUBMITTED,
        ))
        db.session.commit()
        flash("Report submitted for district review.", "success")
        return redirect(url_for("tvk.hub"))
    return render_template("tvk/party_complaint.html")


@bp.route("/news/new", methods=["GET", "POST"])
@login_required
def news_manage():
    if g.current_user.role.value not in ("admin", "volunteer"):
        flash("Posting restricted to authorized cadre accounts.", "error")
        return redirect(url_for("tvk.hub"))
    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        body = (request.form.get("body") or "").strip()
        district = (request.form.get("district") or "").strip()
        if not title:
            flash("Title required.", "error")
            return redirect(url_for("tvk.news_manage"))
        n = NewsItem(title=title, body=body, district=district or None, created_by_id=g.current_user.id)
        db.session.add(n)
        db.session.commit()
        socketio.emit("tvk_news", {"title": title, "district": district}, namespace="/")
        log_audit(g.current_user.id, "tvk_news_post", title[:80])
        db.session.commit()
        flash("Announcement published.", "success")
        return redirect(url_for("tvk.hub"))
    return render_template("tvk/news_form.html")


@bp.get("/war-room")
@login_required
def war_room():
    if g.current_user.role.value not in ("admin",):
        flash("Election war room is leadership-only.", "error")
        return redirect(url_for("tvk.hub"))
    profiles = VolunteerProfile.query.limit(200).all()
    events = Event.query.order_by(Event.id.desc()).limit(20).all()
    return render_template("tvk/war_room.html", profiles=profiles, events=events)
