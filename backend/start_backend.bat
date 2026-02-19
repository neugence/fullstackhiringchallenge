@echo off
echo Starting Smart Blog Editor Backend Server...
echo.
cd /d "%~dp0"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
