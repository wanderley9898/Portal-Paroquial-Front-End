FROM node:20 AS build
ENV TZ="America/Sao_Paulo"

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 4902

CMD ["nginx", "-g", "daemon off;"]
