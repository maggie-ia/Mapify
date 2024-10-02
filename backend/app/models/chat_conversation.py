from app import db
from datetime import datetime

class ChatConversation(db.Model):
    __tablename__ = 'chat_conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)
    conversation_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    feedback = db.Column(db.Enum('positive', 'negative', 'neutral'), default='neutral')
    category_id = db.Column(db.Integer, db.ForeignKey('conversation_categories.id'))

    category = db.relationship('ConversationCategory', backref='conversations')

    def __repr__(self):
        return f'<ChatConversation {self.id}>'