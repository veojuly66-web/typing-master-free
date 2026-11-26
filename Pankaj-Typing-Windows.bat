@echo off
title Pankaj Typing - Launching...
echo ========================================================
echo         PANKAJ TYPING - DESKTOP EDITION
echo ========================================================
echo Launching native desktop window...

start msedge --app="%~dp0index.html" --window-size=1280,840
if %errorlevel% equ 0 exit

start chrome --app="%~dp0index.html" --window-size=1280,840
if %errorlevel% equ 0 exit

start "" "%~dp0index.html"
exit
