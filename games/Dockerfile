# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Install yarn
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Copy dependency files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Accept API URL as build arg
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

# Build the app
RUN yarn build:app

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
