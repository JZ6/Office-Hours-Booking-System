from unittest import skip

from flask import jsonify, json
from test import integration
from api.db import get_db


class TestAPIIdentity(integration.IntegrationTest):
    '''
    Basic functional Identity API endpoint testing of only API-DB interaction.
    '''

    '''
    Posting a valid document should return 200.
    '''

    def test_post_200_local(self):
        with self.app.app_context():
            identity_id = "rossbob2"
            document = {}
            document["id"] = identity_id
            document["studentNumber"] = "1234567890"
            document["firstName"] = "Peter"
            document["lastName"] = "Schultz"
            document["role"] = "ta"
            document["courses"] = ["CSC302", "CSC369"]
            document_json = json.dumps(document)

            response = self.client.post('/identity/' + identity_id,
                                        data=document_json,
                                        content_type='application/json')
            response_data = response.data

            self.assertEqual(response_data.decode("utf-8"), '200\n')

    '''
    Posting an invalid document that doesn't pass the Identity validator should
    throw 404.
    '''
    @skip
    def test_post_404_local_validator(self):
        with self.app.app_context():
            identity_id = "mcgregor1"
            document = {}
            document["id"] = identity_id
            document["studentNumber"] = "100549445"
            document["firstName"] = "Samuel"
            document["lastName"] = "Linetsky"
            document["role"] = "inductor"
            document["courses"] = ["CS302", "CSC373"]
            document_json = json.dumps(document)

            response = self.client.post('/identity/' + identity_id,
                                        data=document_json,
                                        content_type='application/json')
            response_data = response.data

            self.assertEqual(response_data.decode("utf-8"), '404\n')

    '''
    Posting a valid document with an id that differs than the id given to the
    endpoint should throw 404.
    '''

    def test_post_404_local_mismatch(self):
        with self.app.app_context():
            identity_id = "rossbob2"
            document = {}
            document["id"] = identity_id
            document["studentNumber"] = "1232567890"
            document["firstName"] = "George"
            document["lastName"] = "Clooney"
            document["role"] = "instructor"
            document["courses"] = ["CSC302", "CSC373"]
            document_json = json.dumps(document)

            response = self.client.post('/identity/' + identity_id + 'a',
                                        data=document_json,
                                        content_type='application/json')
            response_data = response.data

            self.assertEqual(response_data.decode("utf-8"), '404\n')

    '''
    Getting an existing document should return a valid JSON document with
    response code 200.
    '''

    def test_get_200_local(self):
        with self.app.app_context():
            # First POST a valid document.
            identity_id = "rossbob2"
            document = {}
            document["id"] = identity_id
            document["studentNumber"] = "1234567890"
            document["firstName"] = "Peter"
            document["lastName"] = "Schultz"
            document["role"] = "ta"
            document["courses"] = ["CSC302", "CSC369"]
            document_json = json.dumps(document)

            self.client.post('/identity/' + identity_id,
                             data=document_json,
                             content_type='application/json')

            # Then GET the same document
            response = self.client.get('/identity/' + identity_id,
                                       content_type='application/json')
            response_data = response.data
            self.assertEqual(json.loads(response_data.decode("utf-8")),
                             json.loads(document_json))

    '''
    Attempting to get a document that doesn't exist should return response
    code 404.
    '''

    def test_get_404_local(self):
        identity_id = "missigno2"
        
        response = self.client.get('/identity/' + identity_id,
                                   content_type='application/json')
        response_data = response.data
        self.assertEqual(response_data.decode("utf-8"),
                         '404\n')
