# Based on Flask tutorial app
import os
import re
import json
import logging

from flask import current_app, g
from flask_pymongo import PyMongo
from flask.cli import with_appcontext
from click import command as click_command, echo

LOGGER = logging.getLogger(__name__)


def get_db():
    if 'mongo' not in g:
        g.mongo = PyMongo(current_app)
    
    if g.mongo.db is None:
        g.mongo.db = g.mongo.cx[current_app.config['DB_NAME']]

    return g.mongo.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.client.close()


def init_db():
    # Currently done separately by docker-compose
    # run: mongo $MONGO_HOST/$MONGO_DB_NAME ../mongo_config/create_db_dev.js
    current_app.logger.setLevel(logging.INFO)
    db = get_db()

    if current_app.config['ENV'] == 'dev':
        db.client.drop_database(db.name)

    # Create collections with schema validators
    for filename in os.listdir(os.getcwd() + "/mongo_config/validators/"):
        matcher = re.match(re.compile("^(\w+)_validator\.json"), filename)
        if matcher is None:
            continue
        data_type = matcher.group(1)
        with current_app.open_resource("../mongo_config/validators/" + filename) as f: 
            db.create_collection(data_type, validator=json.load(f))

    current_app.logger.info("Succesfully created collections with validators: " + ", ".join(entry['name'] for entry in db.list_collections()))


@click_command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


