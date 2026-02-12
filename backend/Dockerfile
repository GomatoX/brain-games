FROM node:20-alpine

WORKDIR /app

# Install build tools for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev --ignore-scripts=false

# Copy project files (snapshot, extensions, etc.)
COPY . .

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose Directus port
EXPOSE 8055

# Bootstrap (apply schema + create admin) then start
CMD ["sh", "-c", "npx directus bootstrap && npx directus start"]
