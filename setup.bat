@echo off
REM Google Calendar Clone - Setup Script for Windows
REM This script helps set up both backend and frontend

echo.
echo Google Calendar Clone - Setup Script
echo =====================================
echo.

REM Check for Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Node.js not found. Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js %NODE_VERSION% found
echo.

REM Check for MongoDB
echo Checking MongoDB...
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo MongoDB found locally
) else (
    echo WARNING: MongoDB not found locally. Using MongoDB Atlas? Update MONGODB_URI in backend\.env
)
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    echo Backend dependencies installed
) else (
    echo Backend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo .env created. Update MONGODB_URI if needed
) else (
    echo .env already exists
)

cd ..
echo.

REM Setup Frontend
echo Setting up Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo Frontend dependencies installed
) else (
    echo Frontend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
    ) > .env
    echo .env created
) else (
    echo .env already exists
)

cd ..
echo.

REM Final instructions
echo.
echo =====================================
echo Setup Complete!
echo =====================================
echo.
echo To start the application:
echo.
echo 1. Start MongoDB (if using local):
echo    mongod
echo.
echo 2. In PowerShell/CMD 1, start the backend:
echo    cd backend
echo    npm run dev
echo.
echo 3. In PowerShell/CMD 2, start the frontend:
echo    cd frontend
echo    npm start
echo.
echo The app will open at http://localhost:3000
echo.
echo Documentation:
echo - Root: README.md
echo - Backend: backend/README.md
echo - Frontend: frontend/README.md
echo.
pause
