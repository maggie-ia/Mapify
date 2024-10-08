from app import db

class ConversationCategory(db.Model):
    __tablename__ = 'conversation_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    def __repr__(self):
        return f'<ConversationCategory {self.name}>'