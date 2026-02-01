@echo off
echo ========================================
echo   Firebase Backend - Starting Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and fill in your Firebase credentials
    echo.
    pause
    exit /b 1
)

echo Starting Firebase Backend Server...
echo.
node src/index.js

pause
