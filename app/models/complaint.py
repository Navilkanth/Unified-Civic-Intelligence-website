from app.extensions import db


class Complaint(db.Model):
    __tablename__ = "complaints"

    id = db.Column(db.Integer, primary_key=True)
    citizen_name = db.Column(db.String(255), nullable=False)
    complaint_type = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    evidence_path = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default="Pending", nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "citizen_name": self.citizen_name,
            "complaint_type": self.complaint_type,
            "description": self.description,
            "evidence_path": self.evidence_path,
            "status": self.status,
        }