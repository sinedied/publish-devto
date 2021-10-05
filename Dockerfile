FROM node:16-alpine
COPY dist dist
ENTRYPOINT [ "node", "/dist/index.js" ]
