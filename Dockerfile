FROM node:16-alpine
RUN apk --no-cache add git
COPY dist dist
ENTRYPOINT [ "node", "/dist/index.js" ]
