FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x /usr/src/app/docker-insert-env-vars.sh
RUN /usr/src/app/docker-insert-env-vars.sh
RUN npm run build
ENV PORT=4200
EXPOSE $PORT
CMD npm run prod
