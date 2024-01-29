FROM node:latest as build

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]