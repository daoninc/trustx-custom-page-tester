#!/bin/bash

# Start the Flask development server
cd "$(dirname "$0")"
source venv/bin/activate
python app.py

