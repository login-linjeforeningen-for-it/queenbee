FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN /bin/sh /app/build.sh
ENV PORT=4200
EXPOSE $PORT
CMD npm run prod
