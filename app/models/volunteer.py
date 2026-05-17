from datetime import datetime
import enum

from app.extensions import db


class VolunteerProfile(db.Model):
    __tablename__ = "volunteers"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True)
    district = db.Column(db.String(128))
    ward_code = db.Column(db.String(32))
    booth = db.Column(db.String(64))
    skills = db.Column(db.Text)
    availability = db.Column(db.String(255))
    points = db.Column(db.Integer, default=0)
    rank_label = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="volunteer_profile")


class EventType(str, enum.Enum):
    RALLY = "rally"
    CAMPAIGN = "campaign"
    TRAINING = "training"
    RELIEF = "relief"


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(512), nullable=False)
    description = db.Column(db.Text)
    event_type = db.Column(db.Enum(EventType), default=EventType.CAMPAIGN)
    district = db.Column(db.String(128))
    starts_at = db.Column(db.DateTime)
    ends_at = db.Column(db.DateTime)
    location = db.Column(db.String(512))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    qr_secret = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    attendance = db.relationship("Attendance", back_populates="event")


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(512), nullable=False)
    description = db.Column(db.Text)
    assignee_id = db.Column(db.Integer, db.ForeignKey("volunteers.id"))
    created_by_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    status = db.Column(db.Enum(TaskStatus), default=TaskStatus.PENDING)
    due_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    assignee = db.relationship("VolunteerProfile", foreign_keys=[assignee_id])


class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"))
    volunteer_id = db.Column(db.Integer, db.ForeignKey("volunteers.id"))
    checked_in_at = db.Column(db.DateTime, default=datetime.utcnow)
    method = db.Column(db.String(32), default="qr")

    event = db.relationship("Event", back_populates="attendance")


class MembershipCard(db.Model):
    __tablename__ = "membership_cards"

    id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey("volunteers.id"), unique=True)
    card_number = db.Column(db.String(64), unique=True, nullable=False)
    qr_payload = db.Column(db.String(512), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)


class PartyComplaintStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    DISTRICT_REVIEW = "district_review"
    LEADERSHIP_REVIEW = "leadership_review"
    CLOSED = "closed"


class PartyMemberComplaint(db.Model):
    __tablename__ = "party_member_complaints"

    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    subject_user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    title = db.Column(db.String(512), nullable=False)
    body = db.Column(db.Text, nullable=False)
    evidence_url = db.Column(db.String(1024))
    status = db.Column(
        db.Enum(PartyComplaintStatus), default=PartyComplaintStatus.SUBMITTED
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class NewsItem(db.Model):
    __tablename__ = "news_items"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(512), nullable=False)
    body = db.Column(db.Text)
    district = db.Column(db.String(128))
    created_by_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class GamificationBadge(db.Model):
    __tablename__ = "gamification_badges"

    id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey("volunteers.id"))
    badge_code = db.Column(db.String(64), nullable=False)
    label_en = db.Column(db.String(255))
    label_ta = db.Column(db.String(255))
    awarded_at = db.Column(db.DateTime, default=datetime.utcnow)
