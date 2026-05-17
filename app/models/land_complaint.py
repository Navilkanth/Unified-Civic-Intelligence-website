from app.extensions import db


class LandComplaint(db.Model):
    __tablename__ = "land_complaints"

    id = db.Column(db.Integer, primary_key=True)
    citizen_name = db.Column(db.String(255), nullable=False)
    survey_number = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    geo_location = db.Column(db.String(255), nullable=True)
    evidence_path = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default="Pending", nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "citizen_name": self.citizen_name,
            "survey_number": self.survey_number,
            "description": self.description,
            "geo_location": self.geo_location,
            "evidence_path": self.evidence_path,
            "status": self.status,
        }