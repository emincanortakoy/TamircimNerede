@echo off
cd /d "%~dp0"
title Tamircim Nerede

if exist caddy.exe (
    start "Caddy Server" cmd /k "caddy.exe run"
)

node server.js
pause
