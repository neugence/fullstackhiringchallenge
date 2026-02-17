#!/bin/bash

# Startup script for Render deployment
# This ensures we're in the right directory for imports to work

# Get the directory where this script is located
cd "$(dirname "$0")"

# Add project root to PYTHONPATH so 'backend' module can be imported
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Start uvicorn
exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
