from logging import getLogger

from flask_restful import Api

from api.identity import Identity
from api.auth import Auth
from api.block import Block

LOGGER = getLogger(__name__)

def create_api(app):
    api = Api(app)

    LOGGER.info("Initializing API resources")

    api.add_resource(Identity, '/identity/<string:id>')
    api.add_resource(Auth, '/auth', '/auth/<string:id>')
    api.add_resource(Block, '/blocks', '/blocks/<string:block_id>', '/blocks/<string:block_id>/booking')

    return api
