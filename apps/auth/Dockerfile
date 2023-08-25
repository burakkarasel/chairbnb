# using development stage to build the app and get rid of
# the dev dependencies
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# install all dependencies
RUN yarn install
RUN yarn add semver

COPY apps/auth apps/auth
COPY libs libs

RUN cd apps/auth && yarn install

# build the app
RUN yarn build auth

# prod stage
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# install only prod dependencies not dev dependencies
RUN yarn install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/auth/main" ]