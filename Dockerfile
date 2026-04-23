# ─── Stage 1: Build game engine (Svelte) ─────────────────
FROM node:20-alpine AS games-build

WORKDIR /games

COPY games/package.json games/yarn.lock* ./
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
RUN yarn install --frozen-lockfile

COPY games/ .
COPY shared/ /shared/

# Build the SPA (served at /play/) and all IIFE bundles
RUN yarn build:app && yarn build && yarn build:wordgame && yarn build:wordsearch

# ─── Stage 2: Build dashboard (Next.js) ──────────────────
FROM node:20-alpine AS app-deps

WORKDIR /app

COPY app/package.json app/yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS app-build

WORKDIR /app

COPY --from=app-deps /app/node_modules ./node_modules
COPY app/ .
COPY shared/ /shared/

# Copy game engine outputs into Next.js public directory
COPY --from=games-build /games/dist/play ./public/play/
COPY --from=games-build /games/dist/crossword-engine.iife.js ./public/play/dist/crossword-engine.iife.js
COPY --from=games-build /games/dist/word-game-engine.iife.js ./public/play/dist/word-game-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.iife.js ./public/play/dist/word-search-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.css ./public/play/dist/word-search-engine.css
COPY --from=games-build /games/dist/crossword-engine.iife.js ./public/crossword-engine.iife.js
COPY --from=games-build /games/dist/word-game-engine.iife.js ./public/word-game-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.iife.js ./public/word-search-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.css ./public/word-search-engine.css

# Read version from package.json — single source of truth
RUN VERSION=$(node -p "require('./package.json').version") && \
    echo "NEXT_PUBLIC_APP_VERSION=$VERSION" >> .env.production && \
    yarn build

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

# Ensure game SPA is present (direct from games-build, bypasses any cache issues)
COPY --from=games-build /games/dist/play ./public/play/
COPY --from=games-build /games/dist/crossword-engine.iife.js ./public/play/dist/crossword-engine.iife.js
COPY --from=games-build /games/dist/word-game-engine.iife.js ./public/play/dist/word-game-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.iife.js ./public/play/dist/word-search-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.css ./public/play/dist/word-search-engine.css
COPY --from=games-build /games/dist/crossword-engine.iife.js ./public/crossword-engine.iife.js
COPY --from=games-build /games/dist/word-game-engine.iife.js ./public/word-game-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.iife.js ./public/word-search-engine.iife.js
COPY --from=games-build /games/dist/word-search-engine.css ./public/word-search-engine.css

# Verify game SPA exists (fail build if missing)
RUN ls -la public/play/index.html

# Create data directory (will be mounted as a volume)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
