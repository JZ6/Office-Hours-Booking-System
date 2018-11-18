from os import environ
from flask import Flask
from flask_pymongo import PyMongo

mongo_container_name = environ["MONGO_CONTAINER_NAME"]
mongo_port = environ["MONGO_PORT"]
mongo_db = environ["MONGO_DBNAME"] or "dev_db"

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://" + mongo_container_name + ":" + mongo_port + "/" + mongo_db
mongo = PyMongo(app)