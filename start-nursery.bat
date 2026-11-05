@echo off
title Fernwood Launcher
set ROOT=%~dp0
set PHP=php
if exist C:\xampp\php\php.exe set PHP=C:\xampp\php\php.exe

echo Checking MySQL on port 3307...
netstat -an | find ":3307" | find "LISTENING" >nul
if errorlevel 1 (
  if exist C:\xampp\mysql_start.bat (
    echo Starting MySQL...
    start "MySQL" /D C:\xampp /min cmd /c mysql_start.bat
    timeout /t 8 >nul
  ) else (
    echo Could not find XAMPP. Start MySQL from the XAMPP Control Panel, then run this file again.
    pause
    exit /b
  )
)

if not exist "%ROOT%node-service\node_modules" (
  echo First run: installing Node service packages...
  pushd "%ROOT%node-service"
  call npm install
  popd
)
if not exist "%ROOT%frontend-react\node_modules" (
  echo First run: installing website packages, this takes a few minutes...
  pushd "%ROOT%frontend-react"
  call npm install
  popd
)

start "Fernwood PHP API" /D "%ROOT%backend-php" cmd /k ""%PHP%" -S localhost:8000"
start "Fernwood Node" /D "%ROOT%node-service" cmd /k npm start
start "Fernwood Website" /D "%ROOT%frontend-react" cmd /k npm run dev

echo Opening the website...
timeout /t 8 >nul
start http://localhost:5173
exit
