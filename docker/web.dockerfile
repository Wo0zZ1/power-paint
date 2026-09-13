# Фронтенд собирается отдельно от сервисов: Next выдаёт standalone-сборку,
# которая уже содержит нужные зависимости, и общий образ ей не подходит.
# Контекст сборки - корень монорепы.

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable
WORKDIR /app

# Сборка в контейнере упирается в сеть чаще локальной: yarn по умолчанию
# слишком нетерпелив и срывается на таймауте. Задаётся в базовом слое,
# потому что ENV не наследуется между стадиями.
ENV YARN_HTTP_TIMEOUT=600000
ENV YARN_NETWORK_CONCURRENCY=4

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/contracts/package.json packages/contracts/
COPY packages/db/package.json packages/db/
COPY packages/events/package.json packages/events/
COPY apps/auth/package.json apps/auth/
COPY apps/boards/package.json apps/boards/
COPY apps/collab/package.json apps/collab/
COPY apps/gateway/package.json apps/gateway/
COPY apps/migrator/package.json apps/migrator/
COPY apps/users/package.json apps/users/
COPY apps/web/package.json apps/web/
COPY apps/e2e/package.json apps/e2e/
COPY apps/web/patches apps/web/patches
RUN yarn install --immutable

FROM deps AS builder
COPY . .

# Публичные переменные вшиваются в бандл на этапе сборки, поэтому приходят
# аргументами, а не окружением контейнера.
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_DEPLOY_URL
ARG NEXT_PUBLIC_WS_URL

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_DEPLOY_URL=$NEXT_PUBLIC_BASE_DEPLOY_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV GATEWAY_URL=http://gateway:3001

RUN yarn packages:build && yarn web build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
