from flask import Blueprint, request, jsonify, g, flash, redirect, render_template, url_for

from app.extensions import db
from app.models import (
    Beneficiary, Campaign, CharityVolunteerActivity,
    Donation, Sponsor, TrustLedgerEntry,
    WelfareRequest, WelfareRequestType,
)
from app.services.ai_engine import welfare_hints
from app.utils.security import login_required, log_audit

bp = Blueprint("charity", __name__)


# ── JSON API (React) ──────────────────────────────────────────────────────────

@bp.post("/welfare")
def api_welfare():
    data = request.json or {}
    full_name = (data.get("full_name") or "").strip()
    phone = (data.get("phone") or "").strip()
    request_type = (data.get("request_type") or "medical").strip()
    description = (data.get("description") or "").strip()
    address = (data.get("address") or "").strip()

    if not full_name or not phone or not description:
        return jsonify({"error": "Name, phone and description are required."}), 400

    try:
        wt = WelfareRequestType(request_type.lower().replace(" ", "_"))
    except ValueError:
        wt = WelfareRequestType.MEDICAL

    hints = welfare_hints(description)
    user_id = g.current_user.id if g.current_user else None
    wr = WelfareRequest(
        user_id=user_id,
        request_type=wt,
        narrative=description,
        ai_scheme_suggestions=str(hints),
    )
    db.session.add(wr)
    if user_id:
        log_audit(user_id, "welfare_request", wt.value)
    db.session.commit()
    return jsonify({"message": "Welfare request submitted.", "ai_hints": hints}), 201


@bp.get("/transparency")
def api_transparency():
    campaigns = Campaign.query.order_by(Campaign.id.desc()).all()
    total_raised = sum(float(c.raised_amount or 0) for c in campaigns)
    total_distributed = sum(float(getattr(c, "distributed_amount", 0) or 0) for c in campaigns)
    active = sum(1 for c in campaigns if c.is_active)
    beneficiaries = Beneficiary.query.count()
    recent_donations = Donation.query.order_by(Donation.id.desc()).limit(15).all()

    return jsonify({
        "summary": {
            "total_raised": total_raised,
            "total_distributed": total_distributed,
            "active_campaigns": active,
            "beneficiaries": beneficiaries,
        },
        "campaigns": [{
            "id": c.id,
            "title": c.name,
            "raised": float(c.raised_amount or 0),
            "distributed": float(getattr(c, "distributed_amount", 0) or 0),
        } for c in campaigns],
        "recent_donations": [{
            "id": d.id,
            "donor_name": (d.donor.full_name if d.donor and not d.is_anonymous else "Anonymous"),
            "campaign": d.campaign.name if d.campaign else "General",
            "amount": float(d.amount or 0),
            "created_at": d.created_at.isoformat() if getattr(d, "created_at", None) else None,
        } for d in recent_donations],
    })


@bp.get("/sponsors")
def api_sponsors():
    rows = Sponsor.query.order_by(Sponsor.id.desc()).limit(30).all()
    return jsonify([{
        "id": s.id,
        "name": s.organization_name,
        "organization": s.organization_name,
        "total_donated": s.contribution_note,
        "appreciation_quote": s.quote,
    } for s in rows])


@bp.get("/ledger")
def api_ledger():
    entries = TrustLedgerEntry.query.order_by(TrustLedgerEntry.id.desc()).limit(100).all()
    return jsonify([{
        "id": e.id,
        "entry_type": e.entry_type,
        "reference": e.reference,
        "amount": float(e.amount or 0) if e.amount else None,
        "description": getattr(e, "description", e.reference),
        "created_at": e.created_at.isoformat() if getattr(e, "created_at", None) else None,
    } for e in entries])


@bp.get("/activities")
def api_activities():
    rows = CharityVolunteerActivity.query.order_by(CharityVolunteerActivity.id.desc()).limit(50).all()
    return jsonify([{
        "id": a.id,
        "volunteer_name": a.volunteer.user.full_name if a.volunteer and a.volunteer.user else "Anonymous Volunteer",
        "activity_type": a.activity_type,
        "hours": a.hours,
        "notes": a.notes,
        "created_at": a.created_at.isoformat() if a.created_at else None,
    } for a in rows])


@bp.post("/activities")
def api_add_activity():
    data = request.json or {}
    activity_type = (data.get("activity_type") or "").strip()
    hours = float(data.get("hours") or 0)
    notes = (data.get("notes") or "").strip()

    if not activity_type or hours <= 0:
        return jsonify({"error": "Activity type and valid hours are required."}), 400

    from app.models.volunteer import VolunteerProfile
    user_id = g.current_user.id if g.current_user else None
    volunteer = None
    if user_id:
        volunteer = VolunteerProfile.query.filter_by(user_id=user_id).first()
        if not volunteer:
            # Auto-create profile if missing
            volunteer = VolunteerProfile(user_id=user_id, district="Chennai", points=0)
            db.session.add(volunteer)
            db.session.flush()

    activity = CharityVolunteerActivity(
        volunteer_id=volunteer.id if volunteer else None,
        activity_type=activity_type,
        hours=hours,
        notes=notes,
    )
    db.session.add(activity)

    # Reward points
    if volunteer:
        points_earned = int(hours * 10)
        volunteer.points = (volunteer.points or 0) + points_earned
        # Log to ledger
        db.session.add(TrustLedgerEntry(
            entry_type="volunteer_service",
            reference=f"volunteer:{volunteer.id}",
            amount=None,
            metadata_json=f'{{"volunteer_name": "{g.current_user.full_name}", "hours": {hours}, "activity": "{activity_type}", "points_rewarded": {points_earned}}}',
        ))
        log_audit(user_id, "volunteer_service_log", f"{activity_type}:{hours}hrs")

    db.session.commit()
    return jsonify({"message": "Volunteer activity successfully logged on trust ledger!"}), 201


# ── Legacy HTML routes ────────────────────────────────────────────────────────

@bp.get("/")
def hub():
    campaigns = Campaign.query.filter_by(is_active=True).order_by(Campaign.id.desc()).all()
    total_raised = sum(float(c.raised_amount or 0) for c in campaigns)
    beneficiaries = Beneficiary.query.count()
    return render_template("charity/hub.html", campaigns=campaigns, total_raised=total_raised, beneficiaries=beneficiaries)


@bp.route("/welfare/new", methods=["GET", "POST"])
@login_required
def welfare_new():
    if request.method == "POST":
        rtype = (request.form.get("request_type") or "medical").lower()
        narrative = (request.form.get("narrative") or "").strip()
        if not narrative:
            flash("Please describe your situation.", "error")
            return render_template("charity/welfare_form.html")
        try:
            wt = WelfareRequestType(rtype)
        except ValueError:
            wt = WelfareRequestType.MEDICAL
        hints = welfare_hints(narrative)
        wr = WelfareRequest(
            user_id=g.current_user.id,
            request_type=wt,
            narrative=narrative,
            ai_scheme_suggestions=str(hints),
        )
        db.session.add(wr)
        log_audit(g.current_user.id, "welfare_request", wt.value)
        db.session.commit()
        flash("Welfare request captured. AI suggestions attached for reviewer triage.", "success")
        return redirect(url_for("charity.hub"))
    return render_template("charity/welfare_form.html")


@bp.route("/donate", methods=["GET", "POST"])
@login_required
def donate():
    campaigns = Campaign.query.filter_by(is_active=True).all()
    if request.method == "POST":
        cid = int(request.form.get("campaign_id") or 0)
        amount = float(request.form.get("amount") or 0)
        anon = request.form.get("anonymous") == "on"
        if not cid or amount <= 0:
            flash("Select a campaign and valid amount.", "error")
            return render_template("charity/donate.html", campaigns=campaigns)
        camp = Campaign.query.get_or_404(cid)
        camp.raised_amount = float(camp.raised_amount or 0) + amount
        db.session.add(Donation(
            donor_id=g.current_user.id,
            campaign_id=cid,
            amount=amount,
            is_anonymous=anon,
            ledger_ref=f"LDG-{camp.id}-{g.current_user.id}",
        ))
        db.session.add(TrustLedgerEntry(
            entry_type="donation",
            reference=f"campaign:{cid}",
            amount=amount,
            metadata_json='{"channel": "web"}',
        ))
        log_audit(g.current_user.id, "donation", str(amount))
        db.session.commit()
        flash("Thank you. Donation recorded on the public trust ledger.", "success")
        return redirect(url_for("charity.hub"))
    return render_template("charity/donate.html", campaigns=campaigns)


@bp.get("/html/sponsors")
def sponsors():
    rows = Sponsor.query.order_by(Sponsor.id.desc()).limit(30).all()
    return render_template("charity/sponsors.html", sponsors=rows)


@bp.get("/html/transparency")
def transparency():
    campaigns = Campaign.query.filter_by(is_active=True).all()
    total_raised = sum(float(c.raised_amount or 0) for c in campaigns)
    total_beneficiaries = sum(int(c.beneficiary_count or 0) for c in campaigns)
    ledger = TrustLedgerEntry.query.order_by(TrustLedgerEntry.id.desc()).limit(30).all()
    return render_template("charity/transparency.html", campaigns=campaigns, total_raised=total_raised,
                           total_beneficiaries=total_beneficiaries, ledger=ledger)
