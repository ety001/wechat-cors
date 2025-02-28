FROM node:22-alpine

WORKDIR /app

COPY ./server.js /app
ENV PORT=6060

CMD [ "node", "server.js" ]
