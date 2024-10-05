import pytest
import unittest
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

class AuthTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register_and_login(self):
        # Prueba de registro
        response = self.client.post('/auth/register', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'SecurePassword123!'
        })
        self.assertEqual(response.status_code, 201)

        # Prueba de inicio de sesión
        response = self.client.post('/auth/login', json={
            'email': 'test@example.com',
            'password': 'SecurePassword123!'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', json.loads(response.data))

def test_register(client):
    response = client.post('/auth/register', json={
        'username': 'testuser2',
        'email': 'test2@example.com',
        'password': 'SecurePassword123!'
    })
    assert response.status_code == 201
    assert b"Usuario registrado exitosamente" in response.data

def test_login(client):
    # First, register a user
    client.post('/auth/register', json={
        'username': 'testuser3',
        'email': 'test3@example.com',
        'password': 'SecurePassword123!'
    })
    
    # Then, try to login
    response = client.post('/auth/login', json={
        'email': 'test3@example.com',
        'password': 'SecurePassword123!'
    })
    assert response.status_code == 200
    assert 'access_token' in json.loads(response.data)

def test_reset_password_request(client):
    # Register a user
    client.post('/auth/register', json={
        'username': 'testuser4',
        'email': 'test4@example.com',
        'password': 'SecurePassword123!'
    })
    
    # Request password reset
    response = client.post('/auth/initiate-password-reset', json={
        'email': 'test4@example.com'
    })
    assert response.status_code == 200
    assert b"Se ha enviado un correo con instrucciones" in response.data

if __name__ == '__main__':
    unittest.main()