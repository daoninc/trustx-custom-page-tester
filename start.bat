@echo off
echo 🚀 Starting TrustX Custom Page Tester...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found.
    echo Please run the setup first:
    echo   setup.bat
    echo.
    pause
    exit /b 1
)

echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

echo 🌐 Starting application...
echo The application will be available at: http://localhost:5000
echo Press Ctrl+C to stop the application
echo.

python app.py
pause
