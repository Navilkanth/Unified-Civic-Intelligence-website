from datetime import datetime
import enum

from app.extensions import db
from app.models.land_complaint import LandComplaint


class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    COUNCILLOR = "councillor"
    VOLUNTEER = "volunteer"
    DONOR = "donor"
    ADMIN = "admin"


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(32))
    preferred_language = db.Column(db.String(8), default="en")
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.CITIZEN)
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    ward = db.relationship("Ward", back_populates="residents")
    volunteer_profile = db.relationship(
        "VolunteerProfile", back_populates="user", uselist=False
    )


class Ward(db.Model):
    __tablename__ = "wards"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), unique=True, nullable=False)
    name_en = db.Column(db.String(255), nullable=False)
    name_ta = db.Column(db.String(255))
    district = db.Column(db.String(128))
    geometry_geojson = db.Column(db.Text)
    complaint_score = db.Column(db.Float, default=0)
    development_score = db.Column(db.Float, default=0)
    cleanliness_score = db.Column(db.Float, default=0)
    happiness_index = db.Column(db.Float, default=0)

    residents = db.relationship("User", back_populates="ward")
    complaints = db.relationship("Complaint", back_populates="ward")
    projects = db.relationship("PublicProject", back_populates="ward")


class ComplaintStatus(str, enum.Enum):
    OPEN = "open"
    IN_REVIEW = "in_review"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class Complaint(db.Model):
    __tablename__ = "complaints"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"))
    title = db.Column(db.String(512), nullable=False)
    body = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(128))
    is_anonymous = db.Column(db.Boolean, default=False)
    evidence_url = db.Column(db.String(1024))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    sentiment_score = db.Column(db.Float)
    ai_category = db.Column(db.String(128))
    status = db.Column(db.Enum(ComplaintStatus), default=ComplaintStatus.OPEN)
    councillor_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    ward = db.relationship("Ward", back_populates="complaints")
    submitter = db.relationship("User", foreign_keys=[user_id])


class ProjectStatus(str, enum.Enum):
    PLANNED = "planned"
    ACTIVE = "active"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"


class PublicProject(db.Model):
    __tablename__ = "public_projects"

    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"))
    title = db.Column(db.String(512), nullable=False)
    description = db.Column(db.Text)
    purpose = db.Column(db.Text)
    affected_areas_geojson = db.Column(db.Text)
    timeline_start = db.Column(db.Date)
    timeline_end_expected = db.Column(db.Date)
    completion_percent = db.Column(db.Float, default=0)
    status = db.Column(db.Enum(ProjectStatus), default=ProjectStatus.PLANNED)
    councillor_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    ward = db.relationship("Ward", back_populates="projects")
    fund = db.relationship("GovernmentFund", back_populates="project", uselist=False)


class GovernmentFund(db.Model):
    __tablename__ = "government_funds"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("public_projects.id"), unique=True)
    sanctioned_amount = db.Column(db.Numeric(18, 2), nullable=False)
    spent_amount = db.Column(db.Numeric(18, 2), default=0)
    contractor_name = db.Column(db.String(255))
    contractor_contact = db.Column(db.String(128))
    invoice_urls = db.Column(db.Text)
    work_image_urls = db.Column(db.Text)
    expense_report_url = db.Column(db.String(1024))

    project = db.relationship("PublicProject", back_populates="fund")

    @property
    def remaining(self):
        return float(self.sanctioned_amount or 0) - float(self.spent_amount or 0)


class CouncillorReport(db.Model):
    __tablename__ = "councillor_reports"

    id = db.Column(db.Integer, primary_key=True)
    councillor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"))
    summary = db.Column(db.Text, nullable=False)
    performance_score = db.Column(db.Float)
    period_start = db.Column(db.Date)
    period_end = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class LandReport(db.Model):
    __tablename__ = "land_reports"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    survey_number = db.Column(db.String(128))
    report_type = db.Column(db.String(128))
    description = db.Column(db.Text, nullable=False)
    document_urls = db.Column(db.Text)
    image_urls = db.Column(db.Text)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    status = db.Column(db.String(64), default="open")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class AcquisitionAlert(db.Model):
    __tablename__ = "acquisition_alerts"

    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"))
    title = db.Column(db.String(512), nullable=False)
    notice_text = db.Column(db.Text)
    map_geojson = db.Column(db.Text)
    effective_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class OfficeContact(db.Model):
    __tablename__ = "office_contacts"

    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"), unique=True)
    office_phone = db.Column(db.String(64))
    emergency_phone = db.Column(db.String(64))
    office_hours_en = db.Column(db.String(255))
    office_hours_ta = db.Column(db.String(255))


class AppointmentRequest(db.Model):
    __tablename__ = "appointment_requests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"))
    preferred_slot = db.Column(db.String(255))
    concern = db.Column(db.Text)
    status = db.Column(db.String(64), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    action = db.Column(db.String(128), nullable=False)
    resource = db.Column(db.String(255))
    details = db.Column(db.Text)
    ip_address = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
