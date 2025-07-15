FROM --platform=linux/amd64 ubuntu:latest

ARG NODE_VERSION=22.12.0

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl ca-certificates git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install nvm
ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js and npm using nvm
RUN . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    nvm alias default $NODE_VERSION

ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin/:$PATH"

WORKDIR /app

COPY package*.json ./

RUN npm install -g @vue/cli vite json-server

RUN rm -rf node_modules && npm install

COPY . .

EXPOSE 4090 9000

CMD ["sh", "-c", "npm run dev & npm run api && wait"]