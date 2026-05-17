FROM python:3.12-slim-bookworm
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV FLASK_CONFIG=production
ENV PYTHONUNBUFFERED=1
EXPOSE 5000
CMD ["sh", "-c", "flask --app run init-db && flask --app run seed-demo && gunicorn --workers 1 --threads 4 --worker-class gthread -b 0.0.0.0:${PORT:-5000} --timeout 120 run:app"]
