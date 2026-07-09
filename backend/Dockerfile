# ── Stage 1: Install dependencies & build ────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Production image ───────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install chromium and its dependencies
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      dbus

# Don't run as root
RUN addgroup --system --gid 1001 appgroup \
 && adduser  --system --uid 1001 appuser

# Copy only production dependencies and compiled output
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser

EXPOSE 5000

CMD ["node", "dist/index.js"]
