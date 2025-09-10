From node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

Env PORT=

EXPOSE #PORT

CMD  ["npm", "start"]