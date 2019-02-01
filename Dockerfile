FROM node:11.9-alpine

COPY src /app

WORKDIR /app

RUN npm install
RUN npx webpack
ENTRYPOINT ["node", "dist/main.js"]
