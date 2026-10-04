FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

ENV APP_ENV=development
ENV DB_HOST=localhost
ENV APP_PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]