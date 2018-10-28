from flask import Flask, request
from flask_restful import Resource, Api
from flask_pymongo import PyMongo

app = Flask(__name__)
api = Api(app)

app.config.from_pyfile('app_config.cfg')
mongo = PyMongo(app)

class User(Resource):
    def post(self):
        data = request.get_json()
        return data

api.add_resource(User, '/user')

if __name__ == '__main__':
    app.run(debug=True)