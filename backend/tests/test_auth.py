import pytest
from flask import json
from app import create_app, db
from app.models.user import User

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_register(client):
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'SecurePassword123!'
    })
    assert response.status_code == 201
    assert b"Usuario registrado exitosamente" in response.data

def test_login(client):
    # First, register a user
    client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'SecurePassword123!'
    })
    
    # Then, try to login
    response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'SecurePassword123!'
    })
    assert response.status_code == 200
    assert 'access_token' in json.loads(response.data)

def test_reset_password_request(client):
    # Register a user
    client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'SecurePassword123!'
    })
    
    # Request password reset
    response = client.post('/auth/initiate-password-reset', json={
        'email': 'test@example.com'
    })
    assert response.status_code == 200
    assert b"Se ha enviado un correo con instrucciones" in response.data

# Add more test functions for other authentication routes