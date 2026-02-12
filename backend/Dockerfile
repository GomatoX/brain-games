FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy project files (snapshot, extensions, etc.)
COPY . .

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose Directus port
EXPOSE 8055

# Bootstrap (apply schema + create admin) then start
CMD ["sh", "-c", "npx directus bootstrap && npx directus start"]
