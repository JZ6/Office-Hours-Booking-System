import json
import base64

from test import integration

class TestAPIAuth(integration.IntegrationTest):
    def test_basic_auth(self):
        user = b'testuser'
        valid_credentials = base64.b64encode(user + b':testpassword').decode('utf-8')
        response = self.client.get('/auth', headers={"Authorization": "Basic " + valid_credentials})
        content = json.loads(response.data)
        self.assertIn('id', content)
        self.assertIn('token', content)
        self.assertEqual(content['id'], user.decode('utf-8'))
        self.assertIsNotNone(content['token'])