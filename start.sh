#!/bin/bash

# TrustX Custom Page Tester - Startup Script

echo "🚀 Starting TrustX Custom Page Tester..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found."
    echo "Please run the setup first:"
    echo "  ./setup.sh"
    echo ""
    exit 1
fi

echo "🔧 Activating virtual environment..."
source venv/bin/activate

echo "🌐 Starting application..."
echo "The application will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the application"
echo ""

python app.py
