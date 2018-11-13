from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config.from_pyfile('app_config.cfg')
mongo = PyMongo(app)