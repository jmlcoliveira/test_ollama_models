FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY proxy.js .

RUN npm install

EXPOSE 5000

CMD ["node", "proxy.js"]