#!/bin/bash
# Drive-Detection Setup Script for Unix/Linux/Mac

echo "Setting up Drive-Detection Virtual Environment..."

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Drive-Detection setup complete!"
echo "To run the driver state detection:"
echo "  source venv/bin/activate"
echo "  cd driver_state_detection"
echo "  python main.py"


