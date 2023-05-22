FROM node:lts-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN chmod 777 /usr/app/node_modules

COPY . .

CMD ["npm", "run", "dev"]
