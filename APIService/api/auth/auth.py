from hashlib import sha256
from datetime import datetime

from flask_restful import Resource, ResponseBase
from flask import request

from api import mongo


def deny_authorization(reason=None):
    content = {'status': 'Authorization denied.'}
    if reason is not None:
        content['reason'] = reason
    return content, 401


class Auth(Resource):
    # TODO: log request
    def get(self, id):
        # TODO: implement real auth
        if request.authorization is None:
            return deny_authorization("No credentials provided")
        password = request.authorization.password
        username = request.authorization.username
        if not self.check_password(username, password):
            return deny_authorization("Invalid credentials")
        token = self.generate_token(id)
        # TODO: save id/token/expiry
        return {'id': id, 'auth-token': token}

    @staticmethod
    def generate_token(id):
        # TODO: generate a real token?
        timestamp = datetime.utcnow()
        hash_string = bytes(id, "utf8") + bytes(str(timestamp), "utf8")
        return sha256(hash_string).hexdigest()

    @staticmethod
    def check_password(username, password):
        # TODO: actually check tho
        return True


class Token(Resource):
    # TODO: log request
    def delete(self, id):
        # TODO: delete id/token/expiry
        return {'status': "success"}
