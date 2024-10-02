ARG VARIANT="20-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

WORKDIR /workspace

ADD package.json /workspace
ADD yarn.lock /workspace

RUN yarn install

ADD . /workspace

RUN npx playwright install --with-deps