## All together
# docker stop coNext & docker image rm -f next & docker build -t next . && docker run -it --rm -dp 3000:3000 --name coNext next && docker exec -it coNext sh

# Start Dockerfile
ARG VERSION=22-alpine
ARG DIR=usr/app

FROM node:${VERSION} AS builder
# redeclare ARG because ARG not in build environment
ARG DIR
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
RUN corepack enable
WORKDIR /${DIR}
COPY package.json pnpm-lock.yaml ./
# NODE_ENV is intentionally left unset here: devDependencies (typescript, sass,
# postcss-import) are required by `next build`.
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:${VERSION} AS runner
# redeclare ARG because ARG not in build environment
ARG DIR
ENV NODE_ENV=production
# Next standalone binds to $HOSTNAME, which Docker sets to the container ID.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /${DIR}
COPY --from=builder /${DIR}/.next/standalone .
COPY --from=builder /${DIR}/public ./public
COPY --from=builder /${DIR}/.next/static ./.next/static

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
