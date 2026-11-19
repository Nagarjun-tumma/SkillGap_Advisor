@echo off
title SkillGap AI - 1-Click College Demo Launcher
color 0A

echo =========================================================================
echo               SKILLGAP AI -- COLLEGE LAB DEMO LAUNCHER
echo =========================================================================
echo.
echo Starting Backend (Spring Boot 3 REST API on Port 8080)...
start "SkillGap AI Backend" cmd /k "cd /d %~dp0Backend && .\mvnw.cmd spring-boot:run"

echo.
echo Waiting 5 seconds for Backend initialization...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend (Vite React UI on Port 5173)...
start "SkillGap AI Frontend" cmd /k "cd /d %~dp0Frontend && npm run dev"

echo.
echo Waiting 3 seconds for Frontend dev server...
timeout /t 3 /nobreak >nul

echo.
echo Launching SkillGap AI Web App in Default Browser...
start http://localhost:5173

echo.
echo =========================================================================
echo           SUCCESS! SkillGap AI is running for your Demo!
echo           Backend URL  : http://localhost:8080
echo           Frontend URL : http://localhost:5173
echo =========================================================================
echo.
pause
