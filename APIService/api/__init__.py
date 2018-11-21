from flask import Flask
import os
import logging

from .api import create_api

LOGGER = logging.getLogger(__name__)


def get_env_var(env_var_name, default):
    try:
        value = os.environ[env_var_name]
    except KeyError:
        value = default
    LOGGER.info("Environment config:")
    LOGGER.info("%s=%s", env_var_name, value)
    return value


def base_config():
    mongo_host = get_env_var("MONGO_HOST", "localhost")
    mongo_port = get_env_var("MONGO_PORT", "27017")
    mongo_db_name = get_env_var("MONGO_DBNAME", "dev_db")
    return dict(
        SECRET_KEY='dev',
        MONGO_URI="mongodb://" + mongo_host + ":" + mongo_port,
        DB_NAME=mongo_db_name
    )


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.logger.setLevel(logging.INFO)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        try:
            app.config.from_pyfile('config.py')
        except FileNotFoundError:
            app.logger.info("No config file found, loading config from environment variables")
            app.config.from_mapping(
                base_config()
            )
    else:
        # load the test config if passed in
        config_mapping = base_config()
        config_mapping.update(test_config)
        app.logger.info("Config:")
        app.logger.info(config_mapping)
        app.config.from_mapping(**config_mapping)

    create_api(app)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    db.init_app(app)

    return app
