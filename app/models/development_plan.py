from app.extensions import db


class DevelopmentPlan(db.Model):
    __tablename__ = "development_plans"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    affected_areas = db.Column(db.String(255), nullable=False)
    timeline = db.Column(db.String(255), nullable=False)
    purpose = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "affected_areas": self.affected_areas,
            "timeline": self.timeline,
            "purpose": self.purpose,
        }