# Driver Detection API Server

FastAPI server that provides real-time driver state detection with WebSocket video streaming.

## Quick Start

### Install Dependencies

Make sure you're in the drive-detection directory with the venv activated:

**Windows PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements_api.txt
```

**Unix/Linux/Mac:**
```bash
source venv/bin/activate
pip install -r requirements_api.txt
```

### Run the Server

**Windows PowerShell:**
```powershell
python api_server.py
```

**Unix/Linux/Mac:**
```bash
python api_server.py
```

The API will start on `http://localhost:8001`

## API Endpoints

### GET `/`
API root - returns basic info

### GET `/api/status`
Get current detection status and metrics

### POST `/api/start`
Start the camera and begin detection processing

### POST `/api/stop`
Stop the camera and detection

### WebSocket `/ws/video`
Real-time video stream with metrics over WebSocket
- Sends JSON with `image` (base64) and `metrics` (detection data)
- ~30 FPS update rate

## Usage with Frontend

1. Start the API server:
   ```bash
   python api_server.py
   ```

2. The frontend will automatically detect the backend connection
3. Click "Start Detection" on the frontend
4. Real-time video stream and metrics will appear

## Metrics Provided

- **EAR** (Eye Aspect Ratio) - Drowsiness detection
- **Gaze** - Eye gaze direction
- **PERCLOS** - Percentage of eye closure
- **Roll, Pitch, Yaw** - Head pose angles
- **FPS** - Processing frame rate
- **Alerts**: tired, asleep, looking_away, distracted

## Troubleshooting

### Camera Access Issues
- Make sure no other application is using the camera
- Check camera permissions in your OS
- Try a different camera index: modify `VideoCapture(0)` to `VideoCapture(1)`

### Connection Refused
- Make sure the server is running on port 8001
- Check for firewall blocking the port
- Verify you're using `http://localhost:8001`

### Low FPS
- Close other resource-intensive applications
- Lower the video resolution
- Reduce detection complexity

## Development

The API server processes video frames asynchronously and sends updates via WebSocket. The detection uses MediaPipe for face detection and landmark tracking.

### Code Structure

- `api_server.py` - Main FastAPI application
- `driver_state_detection/` - Detection algorithms
  - `attention_scorer.py` - Alert scoring
  - `eye_detector.py` - Eye tracking
  - `pose_estimation.py` - Head pose
  - `utils.py` - Helper functions

## Environment

- Python 3.8+
- OpenCV
- MediaPipe
- FastAPI
- Uvicorn

