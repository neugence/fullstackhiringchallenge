@echo off
echo ========================================
echo Smart Blog Editor - Quick Setup Script
echo ========================================
echo.

REM Check if Python is installed
echo [1/5] Checking Python installation...
py --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✓ Python found

REM Check if Node.js is installed
echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Setup Backend
echo [3/5] Setting up Backend...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    py -m venv venv
)
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
call venv\Scripts\deactivate.bat
cd ..
echo ✓ Backend setup complete

REM Setup Frontend
echo [4/5] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install --silent
)
cd ..
echo ✓ Frontend setup complete

echo.
echo [5/5] Setup Complete! ✓
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Run: start-app.bat
echo    This will start both frontend and backend
echo.
echo 2. Open your browser to: http://localhost:3000
echo.
echo NOTE: MongoDB is optional - app works in offline mode!
echo ========================================
echo.
pause
