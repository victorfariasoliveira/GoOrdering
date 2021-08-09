FROM node:alpine

WORKDIR /usr/ordering-system

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8000

CMD yarn star
