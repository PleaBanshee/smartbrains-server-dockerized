# Dockerfile for automated builds and commands
FROM node:16.13.2

WORKDIR /usr/src/SmartBrains-Server

COPY ./ ./

RUN npm install
CMD ["/bin/sh"]