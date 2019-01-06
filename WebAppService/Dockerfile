FROM node:10-alpine

LABEL MAINTAINER_NAME="Asher Minden-Webb" MAINTAINER_EMAIL="amindenwebb@gmail.com"

RUN set -ex && mkdir /app

ENV REACT_APP_url ${REACT_APP_url}

WORKDIR /app

# -- Install dependencies:
COPY package.json package.json

COPY package-lock.json package-lock.json

RUN npm install --update-binary --no-shrinkwrap

COPY ./ /app

# ENV REACT_APP_useDummyAPI false

CMD REACT_APP_useDummyAPI=false npm start

EXPOSE 3000