#FROM node:carbon
FROM node:9.11.1-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ENTRYPOINT ["npm", "test"]
CMD ["--", "--environment", "lab"]
