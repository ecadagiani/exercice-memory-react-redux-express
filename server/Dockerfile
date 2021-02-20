FROM node:10.10.0-slim

WORKDIR /home/node/app

RUN npm install -g nodemon

ADD package.json /home/node/app/package.json

RUN npm install
RUN mv /home/node/app/node_modules /node_modules

COPY . /home/node/app

ENV SERVER_DB_HOST ''
ENV SERVER_DB_USER ''
ENV SERVER_DB_PASSWORD ''
ENV SERVER_PORT 5000
ENV ENVIRONMENT 'development'

EXPOSE $PORT

RUN useradd --user-group --create-home --shell /bin/false app
RUN chown -R app:app /home/node/app/*
RUN chown -R app:app /home/node/app
USER app

CMD npm run startDev
