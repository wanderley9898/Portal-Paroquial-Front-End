
FROM node:22-alpine

ENV TZ=America/Sao_Paulo

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN yarn global add serve

EXPOSE 4001

CMD ["serve", "-s", "dist", "-l", "4001"]
