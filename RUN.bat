@echo off
REM Complete Application Startup Script
REM This script initializes and starts the entire application

setlocal enabledelayedexpansion

set "PROJECT_ROOT=C:\Users\elmeh\Desktop\projet php"
set "BACKEND=%PROJECT_ROOT%\backend"
set "FRONTEND=%PROJECT_ROOT%"

echo.
echo ==================================================
echo Complete Application Startup
echo ==================================================
echo.

REM Check if backend exists
if not exist "%BACKEND%\bin\console" (
    echo Error: Backend not found at %BACKEND%
    pause
    exit /b 1
)

REM Step 1: Run migrations
echo [1/5] Running database migrations...
cd /d "%BACKEND%"
call php bin/console doctrine:migrations:migrate --no-interaction
if %errorlevel% neq 0 (
    echo Warning: Migrations might have issues
)

REM Step 2: Initialize test data
echo [2/5] Initializing test data...
call php init.php

REM Step 3: Clear cache
echo [3/5] Clearing cache...
call php bin/console cache:clear >nul 2>&1

REM Step 4: Stop old servers
echo [4/5] Starting servers...
call symfony server:stop >nul 2>&1
timeout /t 2 /nobreak >nul
call taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Step 5: Start backend
call symfony server:start -d

REM Step 6: Start frontend
cd /d "%FRONTEND%"
start /min npm run dev

REM Wait for servers to start
timeout /t 3 /nobreak >nul

echo.
echo ==================================================
echo Startup Complete!
echo ==================================================
echo.
echo Your application is ready:
echo   Frontend:    http://127.0.0.1:8081
echo   Backend API: http://127.0.0.1:8000
echo.
echo Test Credentials:
echo   Author: author1@test.com / password123
echo   Admin:  admin@test.com / password123
echo.
echo Opening browser...
start http://127.0.0.1:8081
echo.
echo Press any key to close this window...
pause >nul
