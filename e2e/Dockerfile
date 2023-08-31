FROM node:alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY . .

RUN pnpm install -r

CMD [ "pnpm", "test" ]
