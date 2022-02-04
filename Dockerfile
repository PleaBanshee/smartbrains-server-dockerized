# Dockerfile for automated builds and commands
FROM node:16.13.2

# Create app directory
RUN mkdir -p /usr/src/SmartBrains-Server
WORKDIR /usr/src/SmartBrains-Server

# Install app dependencies
COPY package.json /usr/src/SmartBrains-Server
RUN npm install

# Bundle app source
COPY . /usr/src/SmartBrains-Server

# Build arguments
ARG NODE_VERSION=16.13.2

# Environment
ENV NODE_VERSION $NODE_VERSION 
# CMD ["/bin/sh"]