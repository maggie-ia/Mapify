from app import db
from datetime import datetime

class UsageHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    operation_type = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    details = db.Column(db.String(255))

    user = db.relationship('User', backref=db.backref('usage_history', lazy=True))

    def __repr__(self):
        return f'<UsageHistory {self.operation_type}>'