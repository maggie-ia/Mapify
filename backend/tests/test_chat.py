import unittest
from app import create_app, db
from app.models.user import User
from app.models.document import Document
from app.models.chat_conversation import ChatConversation

class ChatTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        # Create test user and document
        self.user = User(username='testuser', email='test@example.com', membership_type='premium')
        self.user.set_password('password')
        self.document = Document(filename='test.txt', file_type='txt', content='Test content', user_id=self.user.id)
        db.session.add(self.user)
        db.session.add(self.document)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_get_chat_conversation(self):
        # Login
        response = self.client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'password'
        })
        token = response.json['access_token']

        # Test get conversation
        response = self.client.get(f'/api/chat/{self.document.id}', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('messages', response.json)

    def test_send_chat_message(self):
        # Login
        response = self.client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'password'
        })
        token = response.json['access_token']

        # Test send message
        response = self.client.post(f'/api/chat/{self.document.id}', 
                                    json={'message': 'Test message', 'operation': 'chat'},
                                    headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('userMessage', response.json)
        self.assertIn('aiResponse', response.json)

if __name__ == '__main__':
    unittest.main()