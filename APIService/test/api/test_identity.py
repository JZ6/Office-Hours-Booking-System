import json
from flask import jsonify
from test import integration
from api.db import get_db

class TestAPIIdentity(integration.IntegrationTest):
    '''
    Basic functional Identity API endpoint testing of only API-DB interaction.
    '''

    '''
    POST @ /identity should return 200
    '''
    def test_post_200_local(self):
        # (http://flask.pocoo.org/docs/1.0/api/#flask.Flask.test_client) 
        #
        # "Creates a test client for this application. Note that if you are
        # testing for assertions or exceptions in your application code, you
        # must set app.testing = True in order for the exceptions to propagate
        # to the test client."
        self.app.testing = True
        with self.client as c:
            
            identity_id = "rossbob2"
            document = {}
            document["id"] = identity_id
            document["studentNumber"] = "1000549888"
            document["firstName"] = "Peter"
            document["lastName"] = "Schultz"
            document["role"] = "ta"
            document["courses"] = ["CSC302", "CSC369"]
            document_json = jsonify(document)

            # response = self.client.get('/identity', id=identity_id)
            response = c.post('/?id=' + identity_id, json=document_json)
            response_data = json.loads(response.data)
            self.assertEqual("200", response_data)
    
    # def test_post_404_local(self):

    # def test_get_200_local(self):

    # def test_get_404_local(self):