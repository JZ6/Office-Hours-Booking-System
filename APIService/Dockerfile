# APIService

FROM python:3.7

LABEL MAINTAINER_NAME="Asher Minden-Webb" MAINTAINER_EMAIL="amindenwebb@gmail.com"

ENV FLASK_ENV=${FLASK_ENV} \
API_PORT=${API_PORT}

RUN apt-get update -y

RUN set -ex && mkdir /app

WORKDIR /app

# -- Install dependencies:
RUN pip install pipenv

COPY Pipfile Pipfile

COPY Pipfile.lock Pipfile.lock

RUN ["/bin/bash", "-c", \
"pipenv install $(test ${FLASK_ENV:-'dev'} == 'production' || echo '--dev') --deploy --system"]

COPY . /app
COPY docker-scripts/wait-for-it.sh /
RUN chmod +x /wait-for-it.sh

ENTRYPOINT ["/wait-for-it.sh", "-t", "0", "mongodb:27017", "--", "python", "run.py"]