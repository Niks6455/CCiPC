FROM node:23-alpine

WORKDIR /api

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000/tcp
CMD npm start
