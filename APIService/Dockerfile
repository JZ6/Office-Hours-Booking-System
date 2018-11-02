# APIService

FROM python:3.7

MAINTAINER Asher Minden-Webb "amindenwebb@gmail.com"

ENV FLASK_ENV=${FLASK_ENV} \
API_PORT=${API_PORT}

RUN apt-get update -y

CMD set -ex && mkdir /app

WORKDIR /app

# -- Install dependencies:
RUN pip install pipenv

COPY Pipfile Pipfile

COPY Pipfile.lock Pipfile.lock

RUN ["/bin/bash", "-c", \
"pipenv install $(test ${FLASK_ENV:-'dev'} == 'production' || echo '--dev') --deploy --system"]

COPY . /app

ENTRYPOINT ["python", "run.py"]