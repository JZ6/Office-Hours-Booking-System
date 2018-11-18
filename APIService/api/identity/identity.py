from flask import request
from flask_restful import Resource

from api import mongo


class Identity(Resource):
    # TODO: log request
    def post(self, id):
        # TODO: implement
        return {"data": mongo.db.list_collection_names()}

    # TODO: log request
    def get(self, id):
        # TODO: implement
        return {'id': id, 'name': 'dummy'}
