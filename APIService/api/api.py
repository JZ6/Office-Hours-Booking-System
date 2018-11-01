from flask import Flask
from flask_restful import Api
from flask_pymongo import PyMongo

from api.identity import Identity

app = Flask(__name__)
api = Api(app)

app.config.from_pyfile('app_config.cfg')
mongo = PyMongo(app)

api.add_resource(Identity, '/identity/<string:id>')
