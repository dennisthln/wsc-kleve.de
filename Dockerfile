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
COPY --from=base /app/backend/src ./backend/src

# Copy Frontend (from root .output)
COPY --from=base /app/.output ./app/.output
COPY --from=base /app/entrypoint.ts ./entrypoint.ts

# Copy Nginx Config
COPY nginx.conf /etc/nginx/sites-available/default

# Environment defaults
ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=/app/backend/src/payload.config.ts
ENV NUXT_PUBLIC_API_BASE=/api

# We expose the Nginx port
EXPOSE 8080

CMD ["bun", "run", "entrypoint.ts"]
