from logging import getLogger

from flask_restful import Api

from api.identity import Identity
from api.auth import Auth

LOGGER = getLogger(__name__)

def create_api(app):
    api = Api(app)

    LOGGER.info("Initializing API resources")

    api.add_resource(Identity, '/identity/<string:id>')
    api.add_resource(Auth, '/auth', '/auth/<string:id>')

    return api
