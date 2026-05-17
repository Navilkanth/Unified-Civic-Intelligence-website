import click
from dotenv import load_dotenv
load_dotenv()
from flask import Flask

from app.extensions import db
from app.models import (
    Campaign,
    Complaint,
    Event,
    EventType,
    GovernmentFund,
    OfficeContact,
    PublicProject,
    ProjectStatus,
    User,
    UserRole,
    Ward,
    WelfareRequest,
    WelfareRequestType,
)
from app.models.volunteer import NewsItem, VolunteerProfile, Task, TaskStatus, GamificationBadge
from app.models.charity import Sponsor, TrustLedgerEntry, Beneficiary, CharityVolunteerActivity
from werkzeug.security import generate_password_hash


def register(app: Flask) -> None:
    @app.cli.command("init-db")
    def init_db():
        """Create database tables (development / first boot)."""
        db.create_all()
        click.echo("Tables created.")

    @app.cli.command("seed-demo")
    def seed_demo():
        """Idempotent demo data for wards, funds, charity, and admin login."""
        db.create_all()

        def ensure_wards():
            w1 = Ward.query.filter_by(code="W-101").first()
            if not w1:
                w1 = Ward(
                    code="W-101",
                    name_en="Ward 101 — North Zone",
                    name_ta="வார்டு 101 — வடக்கு மண்டலம்",
                    district="Chennai",
                    complaint_score=42,
                    development_score=78,
                    cleanliness_score=71,
                    happiness_index=0.62,
                )
                db.session.add(w1)
                db.session.flush()
            w2 = Ward.query.filter_by(code="W-204").first()
            if not w2:
                w2 = Ward(
                    code="W-204",
                    name_en="Ward 204 — Lake Belt",
                    name_ta="வார்டு 204 — ஏரி பகுதி",
                    district="Chennai",
                    complaint_score=55,
                    development_score=64,
                    cleanliness_score=68,
                    happiness_index=0.55,
                )
                db.session.add(w2)
                db.session.flush()
            return w1, w2

        w1, w2 = ensure_wards()
        if not OfficeContact.query.filter_by(ward_id=w1.id).first():
            db.session.add(
                OfficeContact(
                    ward_id=w1.id,
                    office_phone="+91-44-0000-1010",
                    emergency_phone="108",
                    office_hours_en="Mon–Sat 10:00–17:00",
                    office_hours_ta="திங்கள்–சனி 10:00–17:00",
                )
            )
        if not PublicProject.query.filter_by(title="Smart Road Resurfacing — Marina Link").first():
            proj = PublicProject(
                ward_id=w1.id,
                title="Smart Road Resurfacing — Marina Link",
                description="Cold milling and BT overlay with storm drain upgrades.",
                purpose="Safer mobility and monsoon resilience.",
                completion_percent=60,
                status=ProjectStatus.ACTIVE,
            )
            db.session.add(proj)
            db.session.flush()
            db.session.add(
                GovernmentFund(
                    project_id=proj.id,
                    sanctioned_amount=5000000,
                    spent_amount=3000000,
                    contractor_name="TN Infra Works Pvt Ltd",
                    contractor_contact="+91-44-4000-2200",
                )
            )
        if not Campaign.query.filter_by(name="Medical Relief 2026").first():
            db.session.add(
                Campaign(
                    name="Medical Relief 2026",
                    description="Transparent medical support for verified families.",
                    goal_amount=1000000,
                    raised_amount=420000,
                    beneficiary_count=120,
                    is_active=True,
                )
            )
        if not Complaint.query.filter_by(title="Street light outage near bus stand").first():
            db.session.add(
                Complaint(
                    ward_id=w1.id,
                    title="Street light outage near bus stand",
                    body="Lights are off for two weeks; safety concern at night.",
                    category="infrastructure",
                )
            )
        if not WelfareRequest.query.filter(
            WelfareRequest.narrative.like("%cardiac procedure%")
        ).first():
            db.session.add(
                WelfareRequest(
                    request_type=WelfareRequestType.MEDICAL,
                    narrative="Need support for cardiac procedure documentation.",
                )
            )
        if not Event.query.filter_by(title="Singapadai district coordination meet").first():
            db.session.add(
                Event(
                    title="Singapadai district coordination meet",
                    event_type=EventType.CAMPAIGN,
                    district="Chennai",
                    description="Booth readiness and volunteer briefing.",
                )
            )
        if not User.query.filter_by(email="admin@civic.local").first():
            db.session.add(
                User(
                    email="admin@civic.local",
                    full_name="Platform Administrator",
                    password_hash=generate_password_hash("Admin#12345"),
                    role=UserRole.ADMIN,
                )
            )
        citizen_user = User.query.filter_by(email="citizen@civic.local").first()
        if not citizen_user:
            citizen_user = User(
                email="citizen@civic.local",
                full_name="Demo Citizen",
                password_hash=generate_password_hash("Citizen#123"),
                role=UserRole.CITIZEN,
                ward_id=w1.id,
            )
            db.session.add(citizen_user)
            db.session.flush()

        volunteer_user = User.query.filter_by(email="volunteer@civic.local").first()
        if not volunteer_user:
            volunteer_user = User(
                email="volunteer@civic.local",
                full_name="Active Volunteer",
                password_hash=generate_password_hash("Volunteer#123"),
                role=UserRole.VOLUNTEER,
                ward_id=w1.id,
            )
            db.session.add(volunteer_user)
            db.session.flush()

        councillor_user = User.query.filter_by(email="councillor@civic.local").first()
        if not councillor_user:
            councillor_user = User(
                email="councillor@civic.local",
                full_name="Ward 101 Councillor",
                password_hash=generate_password_hash("Councillor#123"),
                role=UserRole.COUNCILLOR,
                ward_id=w1.id,
            )
            db.session.add(councillor_user)
            db.session.flush()
        
        # Ensure volunteer profile for citizen & volunteer
        citizen_prof = VolunteerProfile.query.filter_by(user_id=citizen_user.id).first()
        if not citizen_prof:
            citizen_prof = VolunteerProfile(user_id=citizen_user.id, district="Chennai", ward_code="W-101", points=150)
            db.session.add(citizen_prof)
            db.session.flush()

        volunteer_prof = VolunteerProfile.query.filter_by(user_id=volunteer_user.id).first()
        if not volunteer_prof:
            volunteer_prof = VolunteerProfile(user_id=volunteer_user.id, district="Chennai", ward_code="W-101", points=320)
            db.session.add(volunteer_prof)
            db.session.flush()
        
        # Seed TVK Tasks
        if not Task.query.filter_by(assignee_id=citizen_prof.id).first():
            db.session.add(Task(title="Distribute Relief Materials in North Zone", description="Ensure that flood relief kits reach the affected families in Ward 101.", assignee_id=citizen_prof.id, status=TaskStatus.IN_PROGRESS))
            db.session.add(Task(title="Organize Local Blood Camp", description="Coordinate with Global Health Trust to set up the venue.", assignee_id=citizen_prof.id, status=TaskStatus.PENDING))
            db.session.add(Task(title="Voter Awareness Drive", description="Door-to-door campaign for electoral awareness.", assignee_id=citizen_prof.id, status=TaskStatus.DONE))

        # Seed Gamification Badges
        if not GamificationBadge.query.filter_by(volunteer_id=citizen_prof.id).first():
            db.session.add(GamificationBadge(volunteer_id=citizen_prof.id, badge_code="singapadai_starter", label_en="Singapadai Starter", label_ta="சிங்கப்படை தொடக்கம்"))
            db.session.add(GamificationBadge(volunteer_id=citizen_prof.id, badge_code="top_contributor", label_en="Top Contributor", label_ta="சிறந்த பங்களிப்பாளர்"))
        
        # Seed TVK News
        if not NewsItem.query.filter_by(title="TVK Party Launch 2026").first():
            db.session.add(NewsItem(title="TVK Party Launch 2026", body="TVK initiates new state-wide public welfare campaign focusing on education and healthcare.", district="Chennai"))
            db.session.add(NewsItem(title="Youth Leadership Conference", body="Thousands of volunteers gathered for the TVK Youth Leadership Conference.", district="Coimbatore"))

        # Seed Sponsor and Beneficiary
        if not Sponsor.query.filter_by(organization_name="Global Health Trust").first():
            db.session.add(Sponsor(organization_name="Global Health Trust", contact_email="contact@globalhealth.org", contribution_note="Donated ₹5,00,000 for medical equipment", quote="Happy to support the noble cause of providing affordable healthcare to all.", logo_url="/static/images/sponsors/global_health.png"))
            db.session.add(Sponsor(organization_name="EduCare NGO", contact_email="info@educarengo.org", contribution_note="Sponsored scholarships for 50 students", quote="Education is the foundation of a bright future.", logo_url="/static/images/sponsors/educare.png"))
        
        db.session.flush()

        # Seed Trust Ledger Entry
        if not TrustLedgerEntry.query.filter_by(reference="DON-2026-001").first():
            db.session.add(TrustLedgerEntry(entry_type="donation", reference="DON-2026-001", amount=1000000.00, metadata_json='{"donor": "Anonymous", "campaign": "Medical Relief 2026"}'))
            db.session.add(TrustLedgerEntry(entry_type="distribution", reference="DIS-2026-001", amount=250000.00, metadata_json='{"beneficiary_count": 12, "purpose": "Emergency Medical Funds"}'))

        db.session.commit()
        click.echo("Seed complete. Log in: admin@civic.local / Admin#12345")
