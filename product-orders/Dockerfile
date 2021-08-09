FROM node:alpine

WORKDIR /usr/product-orders

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8000

CMD yarn star
