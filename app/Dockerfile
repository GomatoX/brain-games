# Stage 1: Install dependencies
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept public env vars at build time
ARG NEXT_PUBLIC_FRONTEND_URL=""
ARG NEXT_PUBLIC_MODE="saas"
ARG NEXT_PUBLIC_PLATFORM_NAME="Rustycogs.io"
ARG NEXT_PUBLIC_PLATFORM_LOGO=""
ARG NEXT_PUBLIC_PLATFORM_ACCENT="#c25e40"
ARG NEXT_PUBLIC_HIDE_LANDING="false"
ARG NEXT_PUBLIC_HIDE_REGISTER="false"
ENV NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}
ENV NEXT_PUBLIC_MODE=${NEXT_PUBLIC_MODE}
ENV NEXT_PUBLIC_PLATFORM_NAME=${NEXT_PUBLIC_PLATFORM_NAME}
ENV NEXT_PUBLIC_PLATFORM_LOGO=${NEXT_PUBLIC_PLATFORM_LOGO}
ENV NEXT_PUBLIC_PLATFORM_ACCENT=${NEXT_PUBLIC_PLATFORM_ACCENT}
ENV NEXT_PUBLIC_HIDE_LANDING=${NEXT_PUBLIC_HIDE_LANDING}
ENV NEXT_PUBLIC_HIDE_REGISTER=${NEXT_PUBLIC_HIDE_REGISTER}

RUN yarn build

# Stage 3: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Create data directory (will be mounted as a volume)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
