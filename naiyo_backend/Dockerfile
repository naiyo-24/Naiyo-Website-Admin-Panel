# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies needed for common Python packages (e.g., psycopg2)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies (copy only backend requirements from root context)
COPY naiyo_backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the backend application code from the root context
COPY naiyo_backend/ ./

# Expose the backend port
EXPOSE 5010

# Command to run the backend (adjust if using Flask, FastAPI, etc.)
CMD ["python", "main.py"]
