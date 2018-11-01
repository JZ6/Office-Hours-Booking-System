from flask import request
from flask_restful import Resource


class Identity(Resource):
    # TODO: log request
    def post(self, id):
        # TODO: implement
        data = request.get_json()
        return data

    # TODO: log request
    def get(self, id):
        # TODO: implement
        return {'id': id, 'name': 'dummy'}
