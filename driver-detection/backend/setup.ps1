# Drive-Detection Setup Script for Windows PowerShell

Write-Host "Setting up Drive-Detection Virtual Environment..." -ForegroundColor Green

# Activate virtual environment
& .\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install requirements
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "Drive-Detection setup complete!" -ForegroundColor Green
Write-Host "To run the driver state detection:" -ForegroundColor Cyan
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  cd driver_state_detection" -ForegroundColor White
Write-Host "  python main.py" -ForegroundColor White


