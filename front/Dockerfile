FROM nginx:1.17.8-alpine
RUN ln -fs /usr/share/zoneinfo/Europe/Madrid /etc/localtime

RUN apk update && apk add nodejs npm

ADD nginx.conf /etc/nginx/nginx.conf

WORKDIR /front/app

ADD ./app/package.json .
RUN npm install -d

ADD ./app .

CMD nginx -g 'daemon off;' & npm run dev