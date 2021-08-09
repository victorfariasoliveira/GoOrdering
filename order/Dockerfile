FROM node:alpine

WORKDIR /usr/order

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8000

CMD yarn star
