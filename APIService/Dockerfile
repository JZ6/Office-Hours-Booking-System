# APIService

FROM python:3.7-alpine

LABEL MAINTAINER_NAME="Asher Minden-Webb" MAINTAINER_EMAIL="amindenwebb@gmail.com"

ENV FLASK_ENV=${FLASK_ENV} \
API_PORT=${API_PORT} \
MONGO_HOST=${MONGO_HOST} \
MONGO_PORT=${MONGO_PORT} \
MONGO_DBNAME=${MONGO_DB_NAME}

RUN set -ex && mkdir /app && pip install pipenv

WORKDIR /app

COPY Pipfile Pipfile

COPY Pipfile.lock Pipfile.lock

RUN pipenv install $(test ${FLASK_ENV:-'dev'} == 'prod' || echo '--dev') --deploy --system

COPY . /app

ENTRYPOINT ["python", "run.py"]