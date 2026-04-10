FROM node:24-alpine AS base

FROM base AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run generate

RUN cp -r /app/prisma/prisma /app/node_modules/.prisma

RUN npm run build

FROM base AS runner
WORKDIR /app

COPY prisma.config.ts ./
COPY prisma ./prisma

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/prisma ./node_modules/.prisma

CMD ["npm", "run", "start"]
