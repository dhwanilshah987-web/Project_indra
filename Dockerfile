# ==========================================
# Stage 1: Build & Dependency Compilation
# ==========================================
FROM python:3.12-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /build

RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ==========================================
# Stage 2: Minimal Runtime Environment
# ==========================================
FROM python:3.12-alpine AS runner

# Fixed PYTHONPATH warning
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/install/bin:$PATH" \
    PYTHONPATH="/install/lib/python3.12/site-packages"

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /install /install

RUN addgroup -S indragroup && adduser -S indrauser -G indragroup

# Copy app and data directories (baked into image)
COPY --chown=indrauser:indragroup ./app ./app
COPY --chown=indrauser:indragroup ./data ./data

USER indrauser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]