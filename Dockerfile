# Unified Dockerfile for Nuxt & Payload with Nginx Proxy
FROM oven/bun:1 AS base

# --- PREPARE ---
WORKDIR /app
COPY . .

# --- BUILD FRONTEND (Nuxt is in root) ---
RUN bun install --frozen-lockfile
RUN bun run build

# --- BUILD BACKEND ---
WORKDIR /app/backend
RUN bun install --frozen-lockfile
RUN bun run build

# --- RUNNER ---
FROM oven/bun:1 AS runner
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy Backend (from backend/.next/standalone)
COPY --from=base /app/backend/.next/standalone ./backend
COPY --from=base /app/backend/.next/static ./backend/.next/static
COPY --from=base /app/public ./backend/public
COPY --from=base /app/backend/node_modules ./backend/node_modules
COPY --from=base /app/backend/package.json ./backend/package.json

# Copy Frontend (from root .output)
COPY --from=base /app/.output ./app/.output

# Copy Nginx Config
COPY nginx.conf /etc/nginx/sites-available/default

# Environment defaults
ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=/app/backend/payload.config.ts
ENV NUXT_PUBLIC_API_BASE=/api

# Start script
RUN echo 'import { spawn } from "child_process"; \
spawn("nginx", ["-g", "daemon off;"], { stdio: "inherit" }); \
spawn("bun", ["run", "backend/server.js"], { stdio: "inherit", env: { ...process.env, PORT: "3000", HOSTNAME: "127.0.0.1" } }); \
spawn("bun", ["run", "app/.output/server/index.mjs"], { stdio: "inherit", env: { ...process.env, PORT: "3001", HOST: "127.0.0.1" } }); \
' > entrypoint.ts

# We expose the Nginx port
EXPOSE 8080

CMD ["bun", "run", "entrypoint.ts"]
