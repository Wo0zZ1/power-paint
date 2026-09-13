FROM node:24-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack enable && yarn install --immutable

FROM base AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && yarn build

RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/server.js"]