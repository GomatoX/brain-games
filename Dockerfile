# ─── Stage 1: Build game engine (Svelte) ─────────────────
FROM node:20-alpine AS games-build

WORKDIR /games

COPY games/package.json games/yarn.lock* ./
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
RUN yarn install --frozen-lockfile

COPY games/ .

# Build the SPA (served at /play/) and IIFE bundles
RUN yarn build:app && yarn build

# ─── Stage 2: Build dashboard (Next.js) ──────────────────
FROM node:20-alpine AS app-deps

WORKDIR /app

COPY app/package.json app/yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS app-build

WORKDIR /app

COPY --from=app-deps /app/node_modules ./node_modules
COPY app/ .

# Copy game engine outputs into Next.js public directory
COPY --from=games-build /games/dist/play ./public/play/
COPY --from=games-build /games/dist/crossword-engine.iife.js ./public/play/dist/crossword-engine.iife.js
COPY --from=games-build /games/dist/word-game-engine.iife.js ./public/play/dist/word-game-engine.iife.js

RUN yarn build

# ─── Stage 3: Production runner ──────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=app-build /app/.next/standalone ./
COPY --from=app-build /app/.next/static ./.next/static
COPY --from=app-build /app/public ./public

# Create data directory (will be mounted as a volume)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
