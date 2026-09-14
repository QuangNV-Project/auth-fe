# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS dependencies

WORKDIR /app

ENV CI=true \
    HUSKY=0

COPY package.json package-lock.json ./

RUN --mount=type=cache,id=auth-fe-npm,target=/root/.npm,sharing=locked \
    npm ci --cache /root/.npm --prefer-offline --no-audit --no-fund

FROM dependencies AS builder

ARG BUILD_ENV_FINGERPRINT

COPY . .

RUN --mount=type=secret,id=frontend_env,target=/app/.env,required=true \
    test -n "$BUILD_ENV_FINGERPRINT" && npm run build

FROM scratch AS artifact

ARG OUTPUT_UID=1000
ARG OUTPUT_GID=1000

COPY --chown=${OUTPUT_UID}:${OUTPUT_GID} --from=builder /app/build /
