"""
FastAPI server for driver state detection with WebSocket video streaming
"""
import cv2
import mediapipe as mp
import numpy as np
import asyncio
import base64
import json
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn

from driver_state_detection.attention_scorer import AttentionScorer as AttentionScorer
from driver_state_detection.eye_detector import EyeDetector
from driver_state_detection.pose_estimation import HeadPoseEstimator
from driver_state_detection.utils import get_landmarks

# Make sure the path includes the driver_state_detection directory
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

app = FastAPI(title="Driver State Detection API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
detection_state = {
    "is_running": False,
    "camera": None,
    "detector": None,
    "eye_det": None,
    "head_pose": None,
    "scorer": None,
    "fps": 0.0,
    "ear": None,
    "gaze": None,
    "perclos": None,
    "roll": None,
    "pitch": None,
    "yaw": None,
    "tired": False,
    "asleep": False,
    "looking_away": False,
    "distracted": False,
}


async def get_detection_state():
    """Get current detection metrics"""
    # Return only serializable data
    return {
        "is_running": detection_state.get("is_running", False),
        "fps": detection_state.get("fps", 0),
        "ear": detection_state.get("ear"),
        "gaze": detection_state.get("gaze"),
        "perclos": detection_state.get("perclos", 0),
        "roll": detection_state.get("roll"),
        "pitch": detection_state.get("pitch"),
        "yaw": detection_state.get("yaw"),
        "tired": detection_state.get("tired", False),
        "asleep": detection_state.get("asleep", False),
        "looking_away": detection_state.get("looking_away", False),
        "distracted": detection_state.get("distracted", False),
        "proc_time": detection_state.get("proc_time"),
    }


@app.on_event("startup")
async def startup():
    """Initialize MediaPipe detector"""
    detection_state["detector"] = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
        refine_landmarks=True,
    )
    detection_state["eye_det"] = EyeDetector(show_processing=False)
    detection_state["head_pose"] = HeadPoseEstimator(show_axis=False)
    
    import time
    detection_state["scorer"] = AttentionScorer(
        t_now=time.perf_counter(),
        ear_thresh=0.2,
        gaze_thresh=0.3,
        ear_time_thresh=2.0,
        gaze_time_thresh=2.0,
        roll_thresh=15,
        pitch_thresh=15,
        yaw_thresh=15,
        pose_time_thresh=2.0,
        verbose=False,
    )


@app.on_event("shutdown")
async def shutdown():
    """Clean up resources"""
    if detection_state["camera"]:
        detection_state["camera"].release()
    cv2.destroyAllWindows()


@app.get("/")
async def root():
    """API root"""
    return {"message": "Driver State Detection API", "version": "1.0.0"}


@app.get("/api/status")
async def get_status():
    """Get current detection status"""
    return await get_detection_state()


@app.post("/api/start")
async def start_detection():
    """Start camera and detection"""
    try:
        if detection_state["is_running"]:
            return {"message": "Detection already running"}
        
        # Open camera
        detection_state["camera"] = cv2.VideoCapture(0)
        if not detection_state["camera"].isOpened():
            raise HTTPException(status_code=500, detail="Cannot open camera")
        
        detection_state["is_running"] = True
        
        # Start detection loop in background
        asyncio.create_task(process_frames())
        
        return {"message": "Detection started", "status": "running"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/stop")
async def stop_detection():
    """Stop camera and detection"""
    detection_state["is_running"] = False
    if detection_state["camera"]:
        detection_state["camera"].release()
        detection_state["camera"] = None
    return {"message": "Detection stopped", "status": "stopped"}


async def process_frames():
    """Process video frames in background"""
    import time
    
    prev_time = time.perf_counter()
    frame_count = 0
    
    while detection_state["is_running"]:
        if not detection_state["camera"] or not detection_state["is_running"]:
            break
        
        # Start the tick counter for computing the processing time for each frame
        e1 = cv2.getTickCount()
        
        ret, frame = detection_state["camera"].read()
        if not ret:
            await asyncio.sleep(0.1)
            continue
        
        # Flip frame for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Calculate FPS
        t_now = time.perf_counter()
        elapsed = t_now - prev_time
        if elapsed > 0:
            detection_state["fps"] = 1 / elapsed
        prev_time = t_now
        
        # Convert BGR to RGB for MediaPipe
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = np.expand_dims(gray, axis=2)
        gray = np.concatenate([gray, gray, gray], axis=2)
        
        # Detect faces
        lms = detection_state["detector"].process(gray).multi_face_landmarks
        
        if lms:
            landmarks = get_landmarks(lms)
            frame_size = (frame.shape[1], frame.shape[0])
            
            # Draw eye keypoints (dots around the eyes)
            detection_state["eye_det"].show_eye_keypoints(
                color_frame=frame, landmarks=landmarks, frame_size=frame_size
            )
            
            # Calculate EAR
            ear = detection_state["eye_det"].get_EAR(landmarks=landmarks)
            detection_state["ear"] = float(round(ear, 3)) if ear else None
            
            # Calculate PERCLOS
            tired, perclos = detection_state["scorer"].get_rolling_PERCLOS(t_now, ear)
            detection_state["tired"] = bool(tired)
            detection_state["perclos"] = float(round(perclos, 3))
            
            # Calculate Gaze
            gaze = detection_state["eye_det"].get_Gaze_Score(
                frame=gray, landmarks=landmarks, frame_size=frame_size
            )
            detection_state["gaze"] = float(round(gaze, 3)) if gaze else None
            
            # Calculate Head Pose (returns frame with 3D axis drawn)
            frame_det, roll, pitch, yaw = detection_state["head_pose"].get_pose(
                frame=frame, landmarks=landmarks, frame_size=frame_size
            )
            # Use the frame with axis drawn if available
            if frame_det is not None:
                frame = frame_det
            
            detection_state["roll"] = float(roll[0]) if roll is not None and len(roll) > 0 else None
            detection_state["pitch"] = float(pitch[0]) if pitch is not None and len(pitch) > 0 else None
            detection_state["yaw"] = float(yaw[0]) if yaw is not None and len(yaw) > 0 else None
            
            # Evaluate scores
            asleep, looking_away, distracted = detection_state["scorer"].eval_scores(
                t_now=t_now,
                ear_score=ear,
                gaze_score=gaze,
                head_roll=roll,
                head_pitch=pitch,
                head_yaw=yaw,
            )
            detection_state["asleep"] = bool(asleep)
            detection_state["looking_away"] = bool(looking_away)
            detection_state["distracted"] = bool(distracted)
            
            # Store processing time
            e2 = cv2.getTickCount()
            proc_time_frame_ms = ((e2 - e1) / cv2.getTickFrequency()) * 1000
            detection_state["proc_time"] = proc_time_frame_ms
        
        frame_count += 1
        await asyncio.sleep(0.033)  # ~30 FPS


@app.websocket("/ws/video")
async def websocket_video(websocket: WebSocket):
    """WebSocket endpoint for video streaming"""
    await websocket.accept()
    import time as time_module
    
    try:
        while detection_state["is_running"]:
            if not detection_state["camera"]:
                await asyncio.sleep(0.1)
                continue
            
            # Start tick counter for processing time
            e1 = cv2.getTickCount()
            
            ret, frame = detection_state["camera"].read()
            if not ret:
                break
            
            # Flip for mirror effect
            frame = cv2.flip(frame, 1)
            
            # Process frame with detections
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = np.expand_dims(gray, axis=2)
            gray = np.concatenate([gray, gray, gray], axis=2)
            
            # Detect faces
            lms = detection_state["detector"].process(gray).multi_face_landmarks
            
            if lms:
                landmarks = get_landmarks(lms)
                frame_size = (frame.shape[1], frame.shape[0])
                
                # Draw eye keypoints
                detection_state["eye_det"].show_eye_keypoints(
                    color_frame=frame, landmarks=landmarks, frame_size=frame_size
                )
                
                # Get and draw head pose with 3D axis
                frame_det, roll, pitch, yaw = detection_state["head_pose"].get_pose(
                    frame=frame, landmarks=landmarks, frame_size=frame_size
                )
                if frame_det is not None:
                    frame = frame_det
            
            # Get current metrics
            metrics = await get_detection_state()
            
            # Draw overlays on frame
            if metrics.get("ear") is not None:
                cv2.putText(frame, f"EAR: {metrics['ear']:.3f}", (10, 50),
                           cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 1, cv2.LINE_AA)
            
            if metrics.get("gaze") is not None:
                cv2.putText(frame, f"Gaze: {metrics['gaze']:.3f}", (10, 80),
                           cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 1, cv2.LINE_AA)
            
            cv2.putText(frame, f"PERCLOS: {metrics['perclos']:.3f}", (10, 110),
                       cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 1, cv2.LINE_AA)
            
            if metrics.get("roll") is not None:
                cv2.putText(frame, f"Roll: {metrics['roll']:.1f}", (450, 40),
                           cv2.FONT_HERSHEY_PLAIN, 1.5, (255, 0, 255), 1, cv2.LINE_AA)
            
            if metrics.get("pitch") is not None:
                cv2.putText(frame, f"Pitch: {metrics['pitch']:.1f}", (450, 70),
                           cv2.FONT_HERSHEY_PLAIN, 1.5, (255, 0, 255), 1, cv2.LINE_AA)
            
            if metrics.get("yaw") is not None:
                cv2.putText(frame, f"Yaw: {metrics['yaw']:.1f}", (450, 100),
                           cv2.FONT_HERSHEY_PLAIN, 1.5, (255, 0, 255), 1, cv2.LINE_AA)
            
            cv2.putText(frame, f"FPS: {metrics['fps']:.0f}", (10, 400),
                       cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 1)
            
            # Show processing time frame
            if 'proc_time' in metrics and metrics['proc_time']:
                cv2.putText(frame, f"PROC. TIME FRAME: {metrics['proc_time']:.0f}ms", (10, 430),
                           cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 1)
            
            # Alerts
            if metrics.get("tired"):
                cv2.putText(frame, "TIRED!", (10, 280),
                           cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 1, cv2.LINE_AA)
            
            if metrics.get("asleep"):
                cv2.putText(frame, "ASLEEP!", (10, 300),
                           cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 1, cv2.LINE_AA)
            
            if metrics.get("looking_away"):
                cv2.putText(frame, "LOOKING AWAY!", (10, 320),
                           cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 1, cv2.LINE_AA)
            
            if metrics.get("distracted"):
                cv2.putText(frame, "DISTRACTED!", (10, 340),
                           cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 1, cv2.LINE_AA)
            
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_bytes = base64.b64encode(buffer).decode('utf-8')
            
            # Send frame with metrics
            data = {
                "image": f"data:image/jpeg;base64,{frame_bytes}",
                "metrics": await get_detection_state()
            }
            
            await websocket.send_json(data)
            await asyncio.sleep(0.033)  # ~30 FPS
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()


@app.get("/api/video")
async def video_stream():
    """HTTP video stream endpoint"""
    async def generate():
        while detection_state["is_running"]:
            if detection_state["camera"]:
                ret, frame = detection_state["camera"].read()
                if ret:
                    _, buffer = cv2.imencode('.jpg', cv2.flip(frame, 1))
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            await asyncio.sleep(0.033)
    
    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")


if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8001, reload=True)

