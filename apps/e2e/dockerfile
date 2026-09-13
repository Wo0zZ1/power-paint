FROM mcr.microsoft.com/playwright:v1.57.0-noble
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack enable && yarn install --frozen-lockfile

RUN yarn test:deps

COPY . .

CMD ["sh", "-c", "yarn test:setup && yarn test"]
