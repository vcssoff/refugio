@echo off
title Refugio Patitas
echo ===================================================
echo   Iniciando Refugio Patitas en http://localhost:3000
echo ===================================================
echo.
cd /d "%~dp0"
start http://localhost:3000
npm run dev
