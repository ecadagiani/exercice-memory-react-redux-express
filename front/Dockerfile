FROM node:10.10.0-slim

WORKDIR /tmp
COPY package.json /tmp/
RUN  npm install

WORKDIR /home/node/app
RUN mv /tmp/node_modules /home/node/app/node_modules
COPY . /home/node/app

ENV FRONT_PORT 3000
EXPOSE $FRONT_PORT

RUN useradd --user-group --create-home --shell /bin/false app
RUN chown -R app:app /home/node/app/*
RUN chown -R app:app /home/node/app
USER app

CMD npm run startDev
