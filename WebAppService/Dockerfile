FROM node:10-alpine

LABEL MAINTAINER_NAME="Asher Minden-Webb" MAINTAINER_EMAIL="amindenwebb@gmail.com"

RUN set -ex && mkdir /app

WORKDIR /app

# -- Install dependencies:
COPY package.json package.json

COPY package-lock.json package-lock.json

RUN npm install

COPY ./ /app

CMD npm start

EXPOSE 3000