FROM node:24-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM base AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run generate

RUN npm run build

FROM base AS runner
WORKDIR /app

COPY package.json package-lock.json prisma.config.ts ./


RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

CMD ["npm", "run", "start"]
