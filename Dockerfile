FROM node:14-alpine

COPY server /nodejs/server
COPY package.json /nodejs/package.json
COPY .npmrc /nodejs/.npmrc

WORKDIR /nodejs
RUN echo $(ls)
RUN npm cache clean --force
RUN npm install

EXPOSE 3000

CMD ["npm","run","server:production"]
