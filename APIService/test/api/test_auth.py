import json
import base64

from test import integration

class TestAPIAuth(integration.IntegrationTest):
    def test_basic_auth(self):
        user = 'admin'
        password = 'admin'
        valid_credentials = f"{user}:{password}"
        response = self.client.get('/auth', headers={"Authorization": "Basic " + valid_credentials})
        content = json.loads(response.data)
        self.assertIn('id', content)
        self.assertIn('token', content)
        self.assertEqual(content['id'], user)
        self.assertIsNotNone(content['token'])
