# Use official lightweight Python image
FROM python:3.11-slim-bookworm

# Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port (Cloud Run provides $PORT)
EXPOSE 8080

# Start server using Gunicorn
CMD ["gunicorn", "--bind", ":8080", "backend.wsgi:application", "--workers", "2", "--threads", "4"]