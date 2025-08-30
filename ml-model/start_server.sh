#!/bin/bash

echo "🚀 Starting Hydrogen Site Recommender FastAPI Server..."
echo

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.7+ and try again"
    exit 1
fi

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "🔧 Activating virtual environment..."
    source venv/bin/activate
else
    echo "🔧 Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

echo
echo "🚀 Starting complete setup and server..."
echo "This will:"
echo "1. Train the ML model (if not already trained)"
echo "2. Save the model as a PKL file"
echo "3. Start the FastAPI server"
echo
echo "🌐 Server will be available at: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔍 Health Check: http://localhost:8000/health"
echo
echo "Press Ctrl+C to stop the server"
echo

python3 setup_and_run.py
