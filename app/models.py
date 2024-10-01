from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    membership_type = db.Column(db.String(20), nullable=False, default='free')
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    documents = relationship('Document', back_populates='user')

class Document(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)
    content = db.Column(db.Text)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    user = relationship('User', back_populates='documents')

# Puedes agregar más modelos para las tablas 'exports' y 'operations' si los necesitas