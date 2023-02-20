FROM node:19.1.0

WORKDIR /opt/service
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json

RUN npm i typescript ts-node -g
RUN npm install
# RUN npm audit fix

EXPOSE 3030

COPY ./ /opt/service
ENTRYPOINT [ "npm", "run", "start" ]