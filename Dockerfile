FROM alpine:3.15

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

RUN set -eux \
    & apk add \
        --no-cache \
        nodejs \
        yarn

RUN yarn install

COPY . .

CMD ["yarn", "start:dev"]