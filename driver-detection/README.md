# C-Drive: AI-Powered Driver Safety System

A comprehensive driver state detection system featuring real-time computer vision monitoring and a modern web interface.

## 🚀 Features

- **Real-Time Driver Monitoring** - Computer vision-based attention and drowsiness detection
- **Beautiful Web Interface** - Dark mode Next.js frontend with animated backgrounds
- **Eye Tracking** - EAR (Eye Aspect Ratio) detection for fatigue monitoring
- **Gaze Detection** - Tracks where the driver is looking
- **Head Pose Estimation** - Monitors driver head position
- **Smart Alerts** - Real-time warnings for drowsiness, distraction, and looking away
- **Live Video Feed** - Stream camera footage with real-time metrics overlay

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **npm or yarn**
- **Webcam/Camera**

⚠️ **CRITICAL SETUP NOTE:** The virtual environment MUST be created at `driver-detection/backend/venv` (not at the root of `driver-detection`). This is required because `api_server.py` uses relative imports that depend on the Python path being set correctly. If you create the venv in the wrong location, you'll get import errors when running `python api_server.py`.

## 🏗️ Project Structure

```
driver-detection/
├── backend/                       # Backend Python code
│   ├── api_server.py            # FastAPI server for camera
│   ├── driver_state_detection/  # Detection algorithms
│   │   ├── attention_scorer.py # Alert scoring
│   │   ├── eye_detector.py     # Eye tracking
│   │   ├── pose_estimation.py  # Head pose estimation
│   │   └── utils.py            # Helper functions
│   ├── camera_calibration/     # Camera calibration tools
│   ├── requirements.txt        # Python dependencies
│   ├── requirements_api.txt    # API server dependencies
│   └── venv/                   # ⚠️ MUST be here (virtual environment)
│
└── frontend/                    # Next.js web application
    ├── app/                    # Next.js pages (App Router)
    │   ├── page.tsx           # Home page
    │   ├── about/              # About page
    │   ├── docs/               # Docs page
    │   └── drive-detection/    # Driver monitoring page
    ├── components/             # React components
    └── package.json           # Frontend dependencies
```

## ⚡ Quick Start

### 1. Setup Backend (Drive-Detection)

**⚠️ IMPORTANT: Create the venv inside the `backend` folder!**

#### For Windows (PowerShell):

```powershell
# Navigate to backend folder
cd driver-detection/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
pip install -r requirements_api.txt
```

#### For Unix/Linux/Mac:

```bash
# Navigate to backend folder
cd driver-detection/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements_api.txt
```

**Why the venv location matters:**
The `api_server.py` file imports from `driver_state_detection` module using a relative path. If you create the venv at `driver-detection/venv` instead of `driver-detection/backend/venv`, the Python imports will fail because the sys.path won't be configured correctly. The venv MUST be inside the backend folder where `api_server.py` is located.

### 2. Setup Frontend

```bash
cd driver-detection/frontend
npm install
```

### 3. Run the System

You need **2 terminals** running:

#### Terminal 1: Drive-Detection API (Port 8001)

**Windows (PowerShell):**
```powershell
cd driver-detection/backend
.\venv\Scripts\Activate.ps1
python api_server.py
```

**Unix/Linux/Mac:**
```bash
cd driver-detection/backend
source venv/bin/activate
python api_server.py
```

#### Terminal 2: Frontend (Port 3000)

```bash
cd driver-detection/frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Drive-Detection API**: http://localhost:8001

Open http://localhost:3000 in your browser and navigate to **Drive Detection** to start monitoring.

## 🎯 Using the Driver Detection

1. Start both the API server (Terminal 1) and frontend (Terminal 2)
2. Navigate to http://localhost:3000/drive-detection
3. Click **"Start Detection"**
4. Grant camera permissions when prompted
5. View real-time metrics and alerts

### What You'll See

- **Live video feed** from your camera
- **Real-time metrics**:
  - EAR (Eye Aspect Ratio) - Drowsiness indicator
  - Gaze Score - Where you're looking
  - PERCLOS - Percentage of eye closure
  - FPS - Processing speed
  - Roll/Pitch/Yaw - Head position angles
- **Smart alerts** for:
  - ⚠️ ASLEEP - Driver appears sleeping
  - ⚠️ TIRED - Fatigue detected
  - ⚠️ LOOKING AWAY - Eyes not on road
  - ⚠️ DISTRACTED - Head position abnormal

## 🔧 API Endpoints

The drive-detection API provides the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/api/status` | GET | Current detection metrics |
| `/api/start` | POST | Start camera and detection |
| `/api/stop` | POST | Stop camera and detection |
| `/ws/video` | WebSocket | Real-time video stream with metrics |

**API Documentation**: http://localhost:8001/docs (FastAPI Swagger)

## 🎨 Frontend Pages

### Home (`/`)
- Welcome message with animated gradient title
- Feature overview
- "Try it out!" button to drive-detection

### About (`/about`)
- Detailed project description
- Technologies used
- Feature highlights

### Docs (`/docs`)
- Complete setup instructions
- Project structure
- Troubleshooting guide

### Drive Detection (`/drive-detection`)
- Live camera feed
- Real-time metrics overlay
- Start/stop controls
- Alert system

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives

### Backend
- **FastAPI** - Python web framework
- **OpenCV** - Computer vision
- **MediaPipe** - Face and pose detection
- **NumPy** - Numerical computing

## 🐛 Troubleshooting

### Camera Not Working
- Close other apps using the camera
- Grant camera permissions
- Check if camera is connected and working
- Try restarting the API server

### "Backend not detected" Error
- Make sure `python api_server.py` is running in Terminal 1
- Check that it's running on port 8001
- Verify no firewall is blocking the connection

### No Video Stream
- Click "Start Detection" on the frontend
- Grant camera permissions when prompted
- Check browser console for errors
- Verify API server terminal shows no errors

### Low FPS / Choppy Video
- Close other resource-intensive applications
- Ensure good lighting
- Check CPU usage
- Try reducing video resolution

### Import Errors

If you see module import errors like `ModuleNotFoundError: No module named 'driver_state_detection'`, this means your venv is in the wrong location.

**Fix:**
```powershell
# Delete the incorrectly placed venv
cd driver-detection
Remove-Item -Recurse -Force venv  # If it exists here

# Create venv in the correct location
cd driver-detection/backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r requirements_api.txt
```

**Why this happens:**
The `api_server.py` file adds the current directory (backend folder) to `sys.path` to import from `driver_state_detection`. If the venv isn't in the backend folder, the Python execution context and path resolution won't work correctly.

## 📝 Standalone Application

The drive-detection system can also be run as a standalone OpenCV application:

**Windows:**
```powershell
cd driver-detection/backend
.\venv\Scripts\Activate.ps1
cd driver_state_detection
python main.py
```

**Unix/Linux/Mac:**
```bash
cd driver-detection/backend
source venv/bin/activate
cd driver_state_detection
python main.py
```

**Press 'q' to quit**

### Command Line Arguments

```bash
python main.py --ear_thresh 0.25 --show_fps --show_axis
```

Available arguments:
- `--camera`: Camera index (default: 0)
- `--ear_thresh`: Eye Aspect Ratio threshold
- `--gaze_thresh`: Gaze threshold
- `--show_eye_proc`: Show eye processing
- `--show_axis`: Show 3D axis for head pose
- `--verbose`: Verbose output

## 🎯 Development

### Running in Development Mode

**Frontend** (with hot reload):
```bash
cd driver-detection/frontend
npm run dev
```

**Drive-Detection API** (with auto-reload):
The API server already runs with auto-reload by default

### Code Structure

**Frontend (`driver-detection/frontend/`):**
- `app/` - Next.js pages (App Router)
- `components/` - React components
  - `layout/` - Navbar component
  - `ui/` - UI components (aurora background, buttons)
- `lib/` - Utility functions

**Backend (`driver-detection/backend/`):**
- `api_server.py` - FastAPI application with WebSocket support
- `driver_state_detection/` - Detection algorithms
  - `attention_scorer.py` - Alert scoring and PERCLOS calculation
  - `eye_detector.py` - Eye tracking and EAR calculation
  - `pose_estimation.py` - Head pose estimation
  - `utils.py` - Helper functions for landmarks
- `venv/` - Virtual environment (⚠️ MUST be in this location)
- `camera_calibration/` - Camera calibration tools

## 🔐 Virtual Environment Setup Explained

The virtual environment MUST be located at `driver-detection/backend/venv` because:

1. **Relative Imports**: The `api_server.py` file imports from `driver_state_detection` module:
   ```python
   from driver_state_detection.attention_scorer import AttentionScorer
   from driver_state_detection.eye_detector import EyeDetector
   from driver_state_detection.pose_estimation import HeadPoseEstimator
   from driver_state_detection.utils import get_landmarks
   ```

2. **Python Path Configuration**: The code adds the backend directory to sys.path:
   ```python
   import sys
   import os
   sys.path.insert(0, os.path.dirname(__file__))
   ```

3. **Execution Context**: When you run `python api_server.py` from the backend folder, Python needs to:
   - Find the `driver_state_detection` package (in the same directory)
   - Have access to the virtual environment's installed packages
   - Resolve imports correctly

If you create the venv in the wrong location (e.g., `driver-detection/venv`), the imports will fail because:
- Python won't be able to find the `driver_state_detection` package
- The sys.path won't be configured correctly
- The module resolution will break

**Correct setup:**
```
driver-detection/
└── backend/
    ├── api_server.py
    ├── driver_state_detection/
    ├── venv/           ← MUST be here
    └── requirements.txt
```

## 📄 License

This project is part of the Claude Builder Hackathon.

## 🆘 Additional Resources

- **Drive-Detection API Docs**: `driver-detection/backend/API_README.md`
- **Camera Calibration**: `driver-detection/backend/camera_calibration/README.md`

## 🎓 Understanding the Detection Algorithm

### Eye Aspect Ratio (EAR)
Detects drowsiness by measuring the vertical and horizontal distance of eye landmarks. Normal EAR ranges from 0.2-0.4.

### PERCLOS
Percentage of eye closure over time - measures accumulated drowsiness. Values above 0.75 indicate fatigue.

### Gaze Detection
Tracks eye direction by analyzing iris position relative to eye boundaries. Values close to 0.5 indicate centered gaze.

### Head Pose Estimation
Monitors head position using 3D pose estimation from facial landmarks. Alerts if roll/pitch/yaw angles exceed ±15°.

---

**Need help?** Check the troubleshooting section or review the API documentation at http://localhost:8001/docs

