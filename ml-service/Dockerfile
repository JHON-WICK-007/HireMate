# ── Stage 1: Build ───────────────────────────────────────────
FROM python:3.12-slim AS builder
WORKDIR /app

# Install system deps for matplotlib / numpy
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM python:3.12-slim AS runner
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY . .

# Create non-root user
RUN addgroup --system --gid 1001 mlgroup \
 && adduser  --system --uid 1001 mluser \
 && mkdir -p /app/models/saved /app/mlruns \
 && chown -R mluser:mlgroup /app

USER mluser

EXPOSE 8000

CMD ["python", "app.py"]
