#!/bin/bash

echo "========================================"
echo "Starting Smart Blog Editor"
echo "========================================"
echo ""

# Start Backend
echo "Starting Backend Server (Port 8000)..."
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend Server (Port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Application Started! ✓"
echo "========================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "NOTE: If MongoDB is not running, the app will"
echo "work in OFFLINE MODE (all features still work!)"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
