from datetime import datetime
import enum

from app.extensions import db


class WelfareRequestType(str, enum.Enum):
    MEDICAL = "medical"
    SCHOLARSHIP = "scholarship"
    FOOD = "food"
    DISASTER = "disaster"


class WelfareRequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    FULFILLED = "fulfilled"


class WelfareRequest(db.Model):
    __tablename__ = "welfare_requests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    request_type = db.Column(db.Enum(WelfareRequestType), nullable=False)
    narrative = db.Column(db.Text, nullable=False)
    document_urls = db.Column(db.Text)
    status = db.Column(
        db.Enum(WelfareRequestStatus), default=WelfareRequestStatus.PENDING
    )
    ai_scheme_suggestions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship("User")


class Campaign(db.Model):
    __tablename__ = "campaigns"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    goal_amount = db.Column(db.Numeric(18, 2))
    raised_amount = db.Column(db.Numeric(18, 2), default=0)
    beneficiary_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    donations = db.relationship("Donation", back_populates="campaign")


class Donation(db.Model):
    __tablename__ = "donations"

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaigns.id"))
    amount = db.Column(db.Numeric(18, 2), nullable=False)
    is_anonymous = db.Column(db.Boolean, default=False)
    ledger_ref = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    campaign = db.relationship("Campaign", back_populates="donations")
    donor = db.relationship("User")


class Beneficiary(db.Model):
    __tablename__ = "beneficiaries"

    id = db.Column(db.Integer, primary_key=True)
    welfare_request_id = db.Column(db.Integer, db.ForeignKey("welfare_requests.id"))
    name = db.Column(db.String(255))
    support_summary = db.Column(db.Text)
    proof_url = db.Column(db.String(1024))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Sponsor(db.Model):
    __tablename__ = "sponsors"

    id = db.Column(db.Integer, primary_key=True)
    organization_name = db.Column(db.String(255), nullable=False)
    contact_email = db.Column(db.String(255))
    contribution_note = db.Column(db.Text)
    quote = db.Column(db.Text)
    logo_url = db.Column(db.String(1024))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class TrustLedgerEntry(db.Model):
    __tablename__ = "trust_ledger"

    id = db.Column(db.Integer, primary_key=True)
    entry_type = db.Column(db.String(64), nullable=False)
    reference = db.Column(db.String(255))
    amount = db.Column(db.Numeric(18, 2))
    metadata_json = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CharityVolunteerActivity(db.Model):
    __tablename__ = "charity_volunteer_activities"

    id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey("volunteers.id"))
    activity_type = db.Column(db.String(128), nullable=False)
    hours = db.Column(db.Float, default=0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    volunteer = db.relationship("VolunteerProfile")
