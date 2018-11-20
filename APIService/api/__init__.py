from flask import Flask
import os
import logging

from .api import create_api

LOGGER = logging.getLogger(__name__)


def get_env_var(env_var_name, default):
    try:
        value = os.environ[env_var_name]
    except KeyError:
        LOGGER.warning("%s missing, using default", env_var_name)
        value = default
    LOGGER.info("%s=%s", env_var_name, value)
    return value


def create_app(test_config=None):
    LOGGER.info("=== Environment variables ===")
    mongo_host = get_env_var("MONGO_HOST", "localhost")
    mongo_port = get_env_var("MONGO_PORT", "27017")
    mongo_db_name = get_env_var("MONGO_DBNAME", "dev_db")
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        MONGO_URI="mongodb://" + mongo_host + ":" + mongo_port + "/" + mongo_db_name,
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    create_api(app)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    db.init_app(app)

    return app
