from app.extensions import db


class GovernmentFund(db.Model):
    __tablename__ = "government_funds"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    sanctioned_amount = db.Column(db.Float, nullable=False)
    spent_amount = db.Column(db.Float, nullable=False)
    remaining_amount = db.Column(db.Float, nullable=False)
    contractor_details = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sanctioned_amount": self.sanctioned_amount,
            "spent_amount": self.spent_amount,
            "remaining_amount": self.remaining_amount,
            "contractor_details": self.contractor_details,
        }


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    completion_percentage = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    invoices = db.relationship("Invoice", backref="project", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "budget": self.budget,
            "completion_percentage": self.completion_percentage,
            "status": self.status,
        }


class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "file_path": self.file_path,
        }