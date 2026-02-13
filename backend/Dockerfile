FROM python:3.9-slim

WORKDIR /app

# Install system dependencies (GL for OpenCV)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip setuptools wheel

COPY requirements.txt .
# Optimization: Increase timeout and retries for large downloads (Torch)
ENV PIP_DEFAULT_TIMEOUT=1000
ENV PIP_RETRIES=5

COPY requirements.txt .

# Install Torch CPU-only FIRST to save bandwidth if no GPU (Standard VPS)
# IF YOU HAVE A GPU, REMOVE "--index-url https://download.pytorch.org/whl/cpu"
# and let it download the CUDA version (default)
# For now, we assume standard VPS to fix the build timeout issues.
# Re-enable CUDA if needed by removing the index-url.
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install remaining requirements (ignoring torch since it's installed)
RUN pip install --no-cache-dir -r requirements.txt

# Install weights separately if needed, or let app handle it via cache volume
# COPY weights ./weights 

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
