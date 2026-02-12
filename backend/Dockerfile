FROM node:20-alpine

WORKDIR /app

# Install yarn
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Copy dependency files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy project files (snapshot, extensions, etc.)
COPY . .

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose Directus port
EXPOSE 8055

# Bootstrap (apply schema + create admin) then start
CMD ["sh", "-c", "npx directus bootstrap && npx directus start"]
