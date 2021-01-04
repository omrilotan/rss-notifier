FROM node:14-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i --production
COPY . .
CMD [ "npm", "start" ]
