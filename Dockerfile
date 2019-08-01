FROM mkenney/npm AS builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run buildprod
RUN rm -rf node_modules
RUN npm install --production

FROM node:alpine AS production
ARG SERVER_PORT=8080
ARG DB_SERVER=127.0.0.1
ARG DB_PORT=3306
ARG DB_NAME=dbTest2
ARG DB_USER=test
ARG DB_PASSWORD=Start!123
LABEL maintainer="gabor.simon75@gmail.com"
RUN mkdir -p /app/public
WORKDIR /app
COPY server.js rest*.js ./
COPY --from=builder /app/public/font public/font
COPY --from=builder /app/public/*.js /app/public/*.html public/
COPY --from=builder /app/node_modules node_modules
RUN echo "\
{\
    \"logger\": {\
        \"appenders\": { \"stderr\": { \"type\": \"stderr\" } },\
        \"categories\": { \"default\": { \"appenders\": [\"stderr\"], \"level\": \"ERROR\" } }\
    },\
    \"server_port\": ${SERVER_PORT},\
    \"db_server\": \"${DB_SERVER}\",\
    \"db_port\": ${DB_PORT},\
    \"db_name\": \"${DB_NAME}\",\
    \"db_user\": \"${DB_USER}\",\
    \"db_password\": \"${DB_PASSWORD}\"\
}\
" >config.json
EXPOSE 8080/tcp
ENTRYPOINT ["/usr/local/bin/node", "server.js"]

#$ docker image build --build-arg DB_SERVER="yadda" --build-arg DB_PASSWD="verysecret" -t frontend:latest .

# vim: set sw=4 ts=4 et indk= :
