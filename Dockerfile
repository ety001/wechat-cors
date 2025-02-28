FROM node:22-alpine

WORKDIR /app

ADD . /app
RUN npm install

ENV PORT=6060

CMD [ "node", "server.js" ]
