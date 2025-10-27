"use client";

import { useState, useRef, useEffect } from "react";
import AuroraBackground from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";

interface DetectionMetrics {
  fps: number;
  ear: number | null;
  gaze: number | null;
  perclos: number;
  roll: number | null;
  pitch: number | null;
  yaw: number | null;
  tired: boolean;
  asleep: boolean;
  looking_away: boolean;
  distracted: boolean;
}

export default function DriveDetection() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DetectionMetrics | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [backendStatus, setBackendStatus] = useState<"connected" | "disconnected" | "checking">("checking");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Check backend connection
    fetch('http://localhost:8001/api/status')
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("disconnected"));
  }, []);

  const startDetection = async () => {
    try {
      setError(null);
      
      // Start the Python backend detection
      const startResponse = await fetch('http://localhost:8001/api/start', {
        method: 'POST'
      });
      
      if (!startResponse.ok) {
        throw new Error("Failed to start backend detection");
      }
      
      // Connect to WebSocket for video stream
      const ws = new WebSocket('ws://localhost:8001/ws/video');
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Update image frame
        if (data.image) {
          setImageSrc(data.image);
        }
        
        // Update metrics
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      };
      
      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("Connection error");
      };
      
      ws.onclose = () => {
        setIsRunning(false);
        setError("Connection closed");
      };
      
      wsRef.current = ws;
      setIsRunning(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start detection");
      console.error("Start detection error:", err);
    }
  };

  const stopDetection = async () => {
    try {
      // Stop the Python backend
      await fetch('http://localhost:8001/api/stop', {
        method: 'POST'
      });
      
      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      setIsRunning(false);
      setMetrics(null);
    } catch (err) {
      console.error("Stop detection error:", err);
    }
  };

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AuroraBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Driver State Detection
            </h1>
            <p className="text-xl text-gray-400">Real-time driver monitoring and safety alerts</p>
          </div>

          {/* Instructions */}
          {!isRunning && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm mb-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">How it works</h2>
              <p className="text-gray-300 mb-6">
                This system uses computer vision to monitor your attention level in real-time. 
                For best results, ensure you have:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
                <li>Good lighting on your face</li>
                <li>Camera positioned at eye level</li>
                <li>Face clearly visible in the frame</li>
              </ul>
              {backendStatus === "disconnected" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
                  <p className="text-red-300 text-sm">
                    <strong>⚠️ Backend not detected:</strong> Make sure the drive-detection API is running on port 8001.
                    <br />
                    Run: <code className="bg-black/50 px-2 py-1 rounded">python api_server.py</code> in the drive-detection directory
                  </p>
                </div>
              )}
              {backendStatus === "connected" && (
                <p className="text-green-300 text-sm">
                  ✅ Backend connected - Full monitoring features available
                </p>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 max-w-3xl mx-auto">
              <p className="text-red-300">{error}</p>
              <p className="text-sm text-gray-400 mt-2">
                Make sure you grant camera permissions to your browser.
              </p>
            </div>
          )}

          {/* Video Preview */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20 mb-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center relative">
              {!isRunning ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-gray-400">Camera feed will appear here</p>
                </div>
              ) : (
                <img
                  src={imageSrc}
                  alt="Camera feed"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col items-center gap-4">
            {backendStatus === "disconnected" && (
              <div className="text-center mb-4">
                <p className="text-red-400">Backend not running. Please start the API server first.</p>
              </div>
            )}
            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <Button
                  onClick={startDetection}
                  disabled={backendStatus === "disconnected"}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                >
                  Start Detection
                </Button>
              ) : (
                <Button
                  onClick={stopDetection}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50"
                >
                  Stop Detection
                </Button>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">Eye Tracking</h3>
              <p className="text-gray-400 text-sm">
                Monitors eye aspect ratio (EAR) to detect drowsiness and fatigue
              </p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Gaze Tracking</h3>
              <p className="text-gray-400 text-sm">
                Tracks gaze direction to detect when you're looking away from the road
              </p>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">Head Pose</h3>
              <p className="text-gray-400 text-sm">
                Estimates head orientation to detect distraction and improper positioning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

