from flask import request, jsonify
from flask_restful import Resource
from ..db import get_db

'''
Returns back a dict that matches the database keys. May be unnecessary after
schema change "utorId" -> "id"
'''
def make_identity_document(data):
    db = get_db()
    document = {}
    document["id"] = data["id"]
    document["studentNumber"] = data["studentNumber"]
    document["firstName"] = data["firstName"]
    document["lastName"] = data["lastName"]
    document["role"] = data["role"]
    document["courses"] = data["courses"]
    return document

'''
Returns the identity document with specified id.
'''
def id_get(id):
    db = get_db()
    utorId_filter = {"id": {"$eq": str(id)}}
    document = db.identity.find_one(utorId_filter)
    return document

'''
Edit the user id via replaceOne.
'''
def id_update(id, data):
    db = get_db()
    document = make_identity_document(data)
    utorId_filter = {"id": {"$eq": str(id)}}
    result = db.identity.replace_one(utorId_filter, document)
    return 200 if result.acknowledged else 404

'''
Create the user id via insert.
'''
def id_create(id, data):
    db = get_db()
    document = make_identity_document(data)
    result = db.identity.insert_one(document)
    return 200 if result.acknowledged else 404

'''
Return whether the given user id exists in the database or not. Helps decide
whether to add (insert) or edit (replaceOne).
'''
def id_exists(id):
    db = get_db()
    return (True if
            db.identity.find({"id": {"$eq": str(id)}}).count() > 0  
            else False)


class Identity(Resource):
    '''
    For MVP assume the data attached with the request is valid and complete, if
    time permits add data verification.
    '''

    '''
    Adds or edits an identity id returning response code 200 upon success.
    '''
    def post(self, id):
        identity_id = id
        data = request.get_json()
        response = 200
        if id_exists(identity_id):
            response = id_create(identity_id, data)
        else:
            response = id_update(identity_id, data)
        
        return response

    '''Returns an identity id if it exists otherwise response 404.'''
    def get(self, id):
        identity_id = id
        if id_exists(identity_id):
            response_data = id_get(identity_id)
            return jsonify(response_data), 200
        
        return 404
