from app.extensions import db


class RescueRequest(db.Model):
    __tablename__ = "rescue_requests"

    id = db.Column(db.Integer, primary_key=True)
    citizen_name = db.Column(db.String(255), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "citizen_name": self.citizen_name,
            "contact_number": self.contact_number,
            "location": self.location,
            "description": self.description,
        }


class EmergencyZone(db.Model):
    __tablename__ = "emergency_zones"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
        }