FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 5050

COPY . .

CMD ["npm" ,"start"]