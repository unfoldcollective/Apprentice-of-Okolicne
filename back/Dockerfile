FROM node:slim

RUN ln -fs /usr/share/zoneinfo/Europe/Madrid /etc/localtime
WORKDIR /back

ADD package.json .
RUN npm install

ADD . /back

CMD npm start
