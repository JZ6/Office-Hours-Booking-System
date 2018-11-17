from flask_restful import Api

from .app import app
from api.identity import Identity
from api.auth import Auth

api = Api(app)

api.add_resource(Identity, '/identity/<string:id>')
api.add_resource(Auth, '/auth', '/auth/<string:id>')
