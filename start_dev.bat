@echo off
echo ========================================
echo  Smart Blog Editor - Development Setup
echo ========================================
echo.

REM Check if backend dependencies are installed
echo [1/4] Checking backend dependencies...
cd backend
python -c "import fastapi, uvicorn, sqlalchemy" 2>nul
if errorlevel 1 (
    echo Backend dependencies not found. Installing...
    python -m pip install -r requirements.txt
) else (
    echo Backend dependencies OK
)
cd ..

REM Check if frontend dependencies are installed
echo.
echo [2/4] Checking frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Frontend dependencies not found. Installing...
    call npm install
) else (
    echo Frontend dependencies OK
)
cd ..

REM Start backend server in new window
echo.
echo [3/4] Starting backend server...
start "Smart Blog Editor - Backend" cmd /k "cd backend && python run.py"
timeout /t 3 /nobreak >nul

REM Start frontend dev server in new window
echo.
echo [4/4] Starting frontend dev server...
start "Smart Blog Editor - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Development servers are starting!
echo ========================================
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause >nul

REM Kill the servers
taskkill /FI "WindowTitle eq Smart Blog Editor - Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Smart Blog Editor - Frontend*" /T /F >nul 2>&1

echo.
echo Servers stopped.
pause
