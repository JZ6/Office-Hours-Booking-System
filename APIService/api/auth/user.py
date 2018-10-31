from flask import request
from flask_restful import Resource


class User(Resource):
    def post(self):
        data = request.get_json()
        return data
