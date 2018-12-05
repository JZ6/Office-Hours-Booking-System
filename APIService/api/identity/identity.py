from flask import request
from flask_restful import Resource
from ..db import get_db

'''
Strips the collection query response of its _id field leaving only relevant
response data. Same thing as make_identity_document, a semantic rename.
'''
def strip_query_response(response):
    return make_identity_document(response)

'''
Returns back a dict that matches the database keys. May be unnecessary after
schema change "utorId" -> "id". Translation function in case of inconsistencies
between what the web app sends and what the api and database expects.
'''
def make_identity_document(data):
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
    return(strip_query_response(db.identity.find_one(utorId_filter)))

'''
Edit the user id via replaceOne.
'''
def id_update(id, data):
    db = get_db()
    document = make_identity_document(data)
    id_filter = {"id": {"$eq": str(id)}}

    # Depend on the validator throwing an error if the document data is not
    # syntactically correct.
    try:
        db.identity.replace_one(id_filter, document)
        return 200
    except:
        return 404

'''
Create the user id via insert.
'''
def id_create(id, data):
    db = get_db()
    document = make_identity_document(data)

    try:
        db.identity.insert_one(document)
        return 200
    except:
        return 404
        
'''
Return whether the given user id exists in the database or not. Decides
whether to add (insert) or edit (replaceOne).
'''
def id_exists(id):
    db = get_db()
    return (True if
            db.identity.count_documents({"id": {"$eq": str(id)}}) > 0
            else False)

class Identity(Resource):
    '''
    Adds or edits an identity id returning response code 200 upon success.
    '''
    def post(self, id):
        identity_id = id
        data = request.get_json()

        # The resource id must be the same as the body's id.
        if str(id) != str(data["id"]):
            return 404

        # POST is an update.
        if id_exists(identity_id):
            return(id_update(identity_id, data))

        # POST is a create.
        return(id_create(identity_id, data))
            
    '''
    Returns an identity id if it exists otherwise response 404.
    '''
    def get(self, id):
        identity_id = id

        if id_exists(identity_id):
            return(id_get(identity_id))
        
        return 404 