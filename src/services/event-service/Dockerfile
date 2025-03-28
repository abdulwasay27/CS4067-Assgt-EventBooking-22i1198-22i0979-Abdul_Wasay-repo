FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY src .
EXPOSE 3002
CMD ["node", "event-service.js"]