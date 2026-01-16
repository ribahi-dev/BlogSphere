@echo off
REM Complete Application Setup Script for Windows

setlocal enabledelayedexpansion

set "PROJECT_ROOT=C:\Users\elmeh\Desktop\projet php"
set "BACKEND=%PROJECT_ROOT%\backend"
set "FRONTEND=%PROJECT_ROOT%"

echo.
echo ==================================================
echo Complete Application Setup
echo ==================================================
echo.

REM Step 1: Database migrations
echo [1/5] Running database migrations...
cd /d "%BACKEND%"
call php bin/console doctrine:migrations:migrate --no-interaction

REM Step 2: Clear cache
echo [2/5] Clearing cache...
call php bin/console cache:clear

REM Step 3: Stop old servers
echo [3/5] Stopping old servers...
call symfony server:stop 2>nul
taskkill /f /im node.exe 2>nul || true
timeout /t 2 /nobreak >nul

REM Step 4: Start backend
echo [4/5] Starting backend on http://127.0.0.1:8000...
call symfony server:start -d

REM Step 5: Start frontend
echo [5/5] Starting frontend on http://127.0.0.1:8081...
cd /d "%FRONTEND%"
start /min npm run dev

timeout /t 3 /nobreak >nul

echo.
echo ==================================================
echo Setup Complete!
echo ==================================================
echo.
echo Access Points:
echo   Backend: http://127.0.0.1:8000
echo   Frontend: http://127.0.0.1:8081
echo.
echo Test Credentials:
echo   Author: author1@test.com / password123
echo   Admin: admin@test.com / password123
echo.
echo Browser opening...
start http://127.0.0.1:8081
echo.
REM Project Setup Script for Windows
REM This script sets up both backend and frontend for development

echo.
echo ======================================
echo Blog Platform - Complete Setup
echo ======================================
echo.

REM Step 1: Backend Setup
echo Step 1: Backend Setup
echo.

if exist "backend" (
  cd backend
  
  if exist "composer.json" (
    echo Installing PHP dependencies...
    call composer install --no-interaction
    
    if not exist ".env.local" (
      echo Creating .env.local...
      copy .env .env.local
      echo WARNING: Please edit backend\.env.local with your configuration
    )
    
    echo Running database migrations...
    call php bin/console doctrine:migrations:migrate --no-interaction
    
    echo [SUCCESS] Backend setup complete
  ) else (
    echo [ERROR] composer.json not found
  )
  
  cd ..
) else (
  echo [ERROR] backend directory not found
)

echo.

REM Step 2: Frontend Setup
echo Step 2: Frontend Setup
echo.

if exist "package.json" (
  echo Installing Node dependencies...
  call npm install
  
  if not exist ".env.local" (
    echo Creating .env.local...
    echo VITE_API_URL=http://localhost:8000/api > .env.local
    echo [SUCCESS] .env.local created
  )
  
  echo [SUCCESS] Frontend setup complete
) else (
  echo [ERROR] package.json not found
)

echo.
echo ======================================
echo [SUCCESS] Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Backend: cd backend ^&^& symfony server:start --no-tls --port=8000
echo 2. Frontend: npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo.
pause
