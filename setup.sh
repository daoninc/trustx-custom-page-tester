#!/bin/bash

# TrustX Custom Page Tester - Unix Setup Script

echo "🚀 Setting up TrustX Custom Page Tester..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ Python is required but not installed."
        echo "Please install Python 3.7+ and try again."
        exit 1
    else
        # Use python if python3 is not available
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# Make sure setup.py is executable and run it
chmod +x setup.py
$PYTHON_CMD setup.py

echo ""
echo "Setup complete! 🎉"