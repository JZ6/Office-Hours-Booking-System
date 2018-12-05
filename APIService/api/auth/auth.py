from hashlib import sha256
from datetime import datetime, timedelta

from flask_restful import Resource
from flask import request

from ..db import get_db


def deny_authorization(reason=None):
    content = {'status': 'Authorization denied.'}
    if reason is not None:
        content['reason'] = reason
    return content, 401


class Auth(Resource):
    # TODO: log request
    def get(self):
        # TODO: implement real auth
        if request.authorization is None:
            return deny_authorization("No credentials provided")
        password = request.authorization.password
        username = request.authorization.username
        if not self.check_password(username, password):
            return deny_authorization("Invalid credentials")
        token = self.generate_token(username)
        get_db().tokens.remove({"utorId": username})
        get_db().tokens.insert_one({
            "utorId": username,
            "token": token,
            "creation": datetime.now(),
            "expiration": datetime.now() + timedelta(days=1)
        })
        # TODO: save hashed token w/ id, permissions, expiry
        return {'id': username, 'token': token}, 200

    @staticmethod
    def generate_token(id):
        # TODO: generate a real token?
        timestamp = datetime.utcnow()
        hash_string = bytes(id, "utf8") + bytes(str(timestamp), "utf8")
        return sha256(hash_string).hexdigest()

    @staticmethod
    def check_password(username, password):
        # TODO: actually check tho
        # Hardcoded users
        if username == 'user1' and password == 'pass1' \
                or username == 'user2' and password == 'pass2' \
                or username == 'admin' and password == 'admin':
            return True
        return False

    def delete(self, id):
        # TODO: delete all tokens for id
        return {'status': "success"}


def authenticate(token):
    # Verify token
    return {'identity': {'id': 'identityX'}}
