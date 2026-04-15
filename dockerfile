FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY patches ./patches

RUN corepack enable && yarn install --immutable

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/.yarnrc.yml ./
COPY . .

ARG NEXT_PUBLIC_BASE_DEPLOY_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_WS_URL
ARG DATABASE_URL

ENV NEXT_PUBLIC_BASE_DEPLOY_URL=$NEXT_PUBLIC_BASE_DEPLOY_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV DATABASE_URL=$DATABASE_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_MODE=production
ENV NODE_ENV=production

RUN corepack enable && yarn prisma generate && yarn next build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV AUTH_TRUST_HOST=true

CMD ["node", "server.js"]