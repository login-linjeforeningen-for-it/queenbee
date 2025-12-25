FROM oven/bun:alpine 

WORKDIR /app

COPY package.json ./

COPY bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
