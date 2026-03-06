#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Colors ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
  echo ""
  echo -e "${CYAN}🧩 Brain Games – Dev Helper${NC}"
  echo "───────────────────────────────────────"
}

# ── Commands ─────────────────────────────────────────────

cmd_install() {
  echo -e "${GREEN}▸ Installing app dependencies...${NC}"
  (cd "$ROOT_DIR/app" && yarn install)

  echo -e "${GREEN}▸ Installing games dependencies...${NC}"
  (cd "$ROOT_DIR/games" && yarn install)

  echo -e "${GREEN}✔ All dependencies installed.${NC}"
}

cmd_dev() {
  echo -e "${GREEN}▸ Starting app (Next.js) & games (Vite) in parallel...${NC}"
  (cd "$ROOT_DIR/app" && yarn dev) &
  APP_PID=$!
  (cd "$ROOT_DIR/games" && yarn dev) &
  GAMES_PID=$!

  trap "kill $APP_PID $GAMES_PID 2>/dev/null; exit" INT TERM
  echo -e "${CYAN}  app   → http://localhost:3000${NC}"
  echo -e "${CYAN}  games → http://localhost:5173${NC}"
  echo -e "${YELLOW}  Press Ctrl+C to stop both.${NC}"
  wait
}

cmd_build() {
  echo -e "${GREEN}▸ Building game engine IIFE bundles...${NC}"
  (cd "$ROOT_DIR/games" && yarn build:all)

  echo -e "${GREEN}▸ Syncing IIFE bundles to app/public...${NC}"
  cp -f "$ROOT_DIR/games/dist/crossword-engine.iife.js" "$ROOT_DIR/app/public/crossword-engine.iife.js" 2>/dev/null || true
  cp -f "$ROOT_DIR/games/dist/word-game-engine.iife.js" "$ROOT_DIR/app/public/word-game-engine.iife.js" 2>/dev/null || true

  echo -e "${GREEN}▸ Building app...${NC}"
  (cd "$ROOT_DIR/app" && yarn build)

  echo -e "${GREEN}✔ Build complete.${NC}"
}

cmd_db_push() {
  echo -e "${GREEN}▸ Pushing DB schema...${NC}"
  (cd "$ROOT_DIR/app" && yarn db:push)
}

cmd_db_seed() {
  echo -e "${GREEN}▸ Seeding database...${NC}"
  (cd "$ROOT_DIR/app" && yarn db:seed)
}

cmd_db_studio() {
  echo -e "${GREEN}▸ Opening Drizzle Studio...${NC}"
  (cd "$ROOT_DIR/app" && yarn db:studio)
}

cmd_docker() {
  echo -e "${GREEN}▸ Starting via Docker Compose...${NC}"
  docker compose -f "$ROOT_DIR/docker-compose.yml" up --build
}

cmd_setup() {
  echo -e "${GREEN}▸ Running first-time setup...${NC}"

  if [ ! -f "$ROOT_DIR/.env" ]; then
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    echo -e "${YELLOW}  Created .env from .env.example – please fill in your values.${NC}"
  else
    echo -e "${CYAN}  .env already exists, skipping.${NC}"
  fi

  cmd_install
  cmd_db_push
  echo -e "${GREEN}✔ Setup complete. Run './dev.sh dev' to start developing.${NC}"
}

# ── Usage ────────────────────────────────────────────────

usage() {
  print_header
  echo ""
  echo "Usage: ./dev.sh <command>"
  echo ""
  echo "Commands:"
  echo "  setup       First-time setup (copy .env, install deps, push DB)"
  echo "  install     Install all dependencies"
  echo "  dev         Start app + games dev servers in parallel"
  echo "  build       Build game engines & app for production"
  echo "  db:push     Push DB schema (drizzle-kit push)"
  echo "  db:seed     Seed the database"
  echo "  db:studio   Open Drizzle Studio"
  echo "  docker      Start everything via Docker Compose"
  echo ""
}

# ── Main ─────────────────────────────────────────────────

case "${1:-}" in
  setup)      cmd_setup ;;
  install)    cmd_install ;;
  dev)        cmd_dev ;;
  build)      cmd_build ;;
  db:push)    cmd_db_push ;;
  db:seed)    cmd_db_seed ;;
  db:studio)  cmd_db_studio ;;
  docker)     cmd_docker ;;
  *)          usage ;;
esac
