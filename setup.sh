#!/bin/bash

echo "========================================"
echo "Smart Blog Editor - Quick Setup Script"
echo "========================================"
echo ""

# Check if Python is installed
echo "[1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed!"
    echo "Please install Python from https://www.python.org/downloads/"
    exit 1
fi
echo "✓ Python found"

# Check if Node.js is installed
echo "[2/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found"

# Setup Backend
echo "[3/5] Setting up Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt --quiet
deactivate
cd ..
echo "✓ Backend setup complete"

# Setup Frontend
echo "[4/5] Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install --silent
fi
cd ..
echo "✓ Frontend setup complete"

echo ""
echo "[5/5] Setup Complete! ✓"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo "1. Run: ./start-app.sh"
echo "   This will start both frontend and backend"
echo ""
echo "2. Open your browser to: http://localhost:3000"
echo ""
echo "NOTE: MongoDB is optional - app works in offline mode!"
echo "========================================"
echo ""
