from app.extensions import db


class WardAnalytics(db.Model):
    __tablename__ = "ward_analytics"

    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, db.ForeignKey("wards.id"), nullable=False)
    complaint_score = db.Column(db.Float, nullable=False, default=0.0)
    development_score = db.Column(db.Float, nullable=False, default=0.0)
    cleanliness_score = db.Column(db.Float, nullable=False, default=0.0)
    happiness_index = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "ward_id": self.ward_id,
            "complaint_score": self.complaint_score,
            "development_score": self.development_score,
            "cleanliness_score": self.cleanliness_score,
            "happiness_index": self.happiness_index,
        }