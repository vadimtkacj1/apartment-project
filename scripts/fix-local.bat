@echo off
REM Fix script for local development errors
REM This script clears cache and restarts the dev server

echo ====================================
echo Fixing Local Development Environment
echo ====================================
echo.

REM Kill all Node.js processes
echo [1/5] Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Clear Next.js cache
echo [2/5] Clearing Next.js cache...
if exist .next rmdir /s /q .next
if exist .next\cache rmdir /s /q .next\cache

REM Clear node_modules cache
echo [3/5] Clearing node_modules cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Generate Prisma Client
echo [4/5] Generating Prisma Client...
call npm run postinstall

REM Start dev server
echo [5/5] Starting dev server...
echo.
echo ====================================
echo Dev server starting on http://localhost:3000
echo Press Ctrl+C to stop
echo ====================================
echo.

call npm run dev
