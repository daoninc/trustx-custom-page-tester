@echo off
REM TrustX Custom Page Tester - Windows Setup Script

echo 🚀 Setting up TrustX Custom Page Tester...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is required but not found in PATH.
    echo Please install Python 3.7+ and try again.
    pause
    exit /b 1
)

REM Run the cross-platform setup script
python setup.py

echo.
echo Press any key to continue...
pause >nul