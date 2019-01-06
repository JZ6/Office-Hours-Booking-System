from unittest import TestCase
from unittest.mock import MagicMock

from flask import g

from api import create_app
from api.db import init_db, get_db


class IntegrationTest(TestCase):

    def setUp(self):
        self.app = self.app_generator()
        self.client = self.get_client(self.app)
    
    def tearDown(self):
        with self.app.app_context():
            get_db().client.drop_database(get_db().name)
        self.app = None
        self.client = None

    @staticmethod
    def app_generator():
        app = create_app({
            'TESTING': True,
            'DB_NAME': 'integration_test_db'
        })

        with app.app_context():
            init_db()

        return app

    @staticmethod
    def get_client(app):
        return app.test_client()
