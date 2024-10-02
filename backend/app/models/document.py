from app import db
from datetime import datetime

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(128))
    content = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    file_type = db.Column(db.String(10))
    embeddings = db.Column(db.PickleType)  # New field for storing embeddings

    def __repr__(self):
        return f'<Document {self.filename}>'