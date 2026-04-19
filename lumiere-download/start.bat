@echo off
echo =======================================================
echo Preparing "Shine With Lumiere" Website...
echo =======================================================
echo.
echo Installing website files (this may take a minute)...
call npm install
echo.
echo =======================================================
echo Starting the Website...
echo =======================================================
call npm run dev
pause
