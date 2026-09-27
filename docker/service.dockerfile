# Общий образ для всех сервисов на Node: они отличаются только именем workspace,
# и шесть почти одинаковых файлов расходились бы при первой же правке.
# Контекст сборки - корень монорепы, иначе общие пакеты недоступны.

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

# Сборка в контейнере упирается в сеть чаще локальной: yarn по умолчанию
# слишком нетерпелив и срывается на таймауте. Задаётся в базовом слое,
# потому что ENV не наследуется между стадиями.
ENV YARN_HTTP_TIMEOUT=600000
ENV YARN_NETWORK_CONCURRENCY=4

FROM base AS deps
# Сначала только манифесты: слой с зависимостями переживает правки исходников.
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
RUN yarn install --immutable

FROM deps AS builder
ARG SERVICE
COPY . .
# Генерация клиента Prisma требует переменную, но к базе не подключается.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN yarn packages:build && yarn workspace @power-paint/${SERVICE} build

# Чистка devDependencies делается здесь, а не в финальном слое: кэш yarn лежит
# в этой стадии, и без него команда полезла бы в сеть за всеми пакетами заново.
RUN yarn workspaces focus @power-paint/${SERVICE} --production && yarn cache clean

FROM base AS runner
ARG SERVICE
ENV NODE_ENV=production
ENV SERVICE=${SERVICE}

COPY --from=builder /app ./

# Сервису не нужно писать в образ, поэтому root ему ни к чему: взлом процесса
# не должен давать права суперпользователя в контейнере.
USER node

CMD yarn workspace @power-paint/${SERVICE} start
