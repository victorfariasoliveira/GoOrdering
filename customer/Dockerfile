FROM node:alpine

WORKDIR /usr/customer

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8000

CMD yarn star
