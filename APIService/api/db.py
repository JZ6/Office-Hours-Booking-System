# Based on Flask tutorial app

from flask import current_app, g
from flask_pymongo import PyMongo
from flask.cli import with_appcontext

from click import command as click_command

def get_db():
    if 'mongo' not in g:
        g.mongo = PyMongo(current_app)
    
    return g.mongo.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.client.close()


def init_db():
    # Currently done by docker-compose or local execution of script
    # run: mongo $MONGO_HOST/$MONGO_DB_NAME ../mongo_config/create_db_dev.js
    pass


@click_command('init-db')
@with_appcontext
def init_db_command():
    # Does nothing
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


