FROM node:16 as build

# App directory
WORKDIR /usr/src/app

#Copy package.json and package.lock.json
COPY package*.json ./

RUN npm ci --production

COPY . .

RUN npm run build

# NGINX web server
FROM nginx:1.21.5 as production

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
