@echo off
echo ========================================
echo Starting Smart Blog Editor
echo ========================================
echo.

REM Start Backend
echo Starting Backend Server (Port 8000)...
cd backend
start "Backend - FastAPI" cmd /k "venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --port 8000"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server (Port 3000)...
cd frontend
start "Frontend - React" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo Application Started! ✓
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo NOTE: If MongoDB is not running, the app will
echo work in OFFLINE MODE (all features still work!)
echo.
echo Press any key to stop all servers...
pause >nul

REM Kill the servers
taskkill /FI "WindowTitle eq Backend - FastAPI*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend - React*" /T /F >nul 2>&1

echo.
echo Servers stopped.
pause
