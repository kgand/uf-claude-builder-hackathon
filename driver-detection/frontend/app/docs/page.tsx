"use client";

import AuroraBackground from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";

export default function Docs() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AuroraBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-xl text-gray-400">Project structure and setup instructions</p>
          </div>

          {/* Quick Start */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Quick Start</h2>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <p className="text-lg text-gray-300 mb-6">
                Get C-Drive up and running in minutes. The project consists of three main components:
              </p>
              <ol className="list-decimal list-inside space-y-4 text-gray-300">
                <li>Backend - FastAPI server for AI web automation</li>
                <li>Drive-Detection - Computer vision driver monitoring</li>
                <li>Frontend - Next.js web interface</li>
              </ol>
            </div>
          </section>

          {/* Project Structure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Project Structure</h2>
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
{`.
├── backend/              # FastAPI backend
│   ├── agents/          # AI agents and graph orchestration
│   ├── tools/           # Custom tools and utilities
│   ├── venv/            # Python virtual environment
│   └── main.py          # FastAPI application entry
├── drive-detection/      # Computer vision system
│   ├── camera_calibration/
│   ├── driver_state_detection/
│   ├── venv/            # Python virtual environment
│   └── requirements.txt
└── frontend/            # Next.js application
    ├── app/             # Next.js pages
    ├── components/      # React components
    └── lib/             # Utility functions`}
              </pre>
            </div>
          </section>

          {/* Backend Setup */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Backend Setup</h2>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Windows PowerShell:</h3>
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium`}
                </pre>
              </div>
              
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Unix/Linux/Mac:</h3>
              <div className="bg-black/50 rounded-lg p-4">
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`cd backend
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium`}
                </pre>
              </div>

              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-300">
                  <strong>Important:</strong> Create a `.env` file in the backend directory with your 
                  Anthropic API key: `ANTHROPIC_API_KEY=your_api_key_here`
                </p>
              </div>
            </div>
          </section>

          {/* Running Backend */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Running the Backend</h2>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300">
{`uvicorn main:app --reload`}
                </pre>
              </div>
              <p className="text-gray-300">
                The backend will run at <span className="text-cyan-400">http://localhost:8000</span>
              </p>
            </div>
          </section>

          {/* Drive-Detection Setup */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Drive-Detection Setup</h2>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`cd drive-detection
.\venv\Scripts\Activate.ps1  # or source venv/bin/activate
pip install -r requirements.txt
cd driver_state_detection
python main.py`}
                </pre>
              </div>
            </div>
          </section>

          {/* Frontend Setup */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Frontend Setup</h2>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300">
{`cd frontend
npm install
npm run dev`}
                </pre>
              </div>
              <p className="text-gray-300">
                The frontend will run at <span className="text-cyan-400">http://localhost:3000</span>
              </p>
            </div>
          </section>

          {/* API Endpoints */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">API Endpoints</h2>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm space-y-4">
              <div>
                <code className="text-cyan-400">GET /</code>
                <p className="text-gray-400 ml-4">Home page</p>
              </div>
              <div>
                <code className="text-cyan-400">POST /do_job</code>
                <p className="text-gray-400 ml-4">Execute a web automation job</p>
              </div>
              <div>
                <code className="text-cyan-400">WebSocket /ws/bot</code>
                <p className="text-gray-400 ml-4">Real-time bot communication</p>
              </div>
            </div>
          </section>

          {/* Additional Resources */}
          <section>
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Troubleshooting</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Make sure Python 3.8+ is installed</li>
                  <li>• Install Playwright browsers</li>
                  <li>• Set ANTHROPIC_API_KEY in .env</li>
                  <li>• Check camera permissions</li>
                </ul>
              </div>
              
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Documentation</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• README.md in root</li>
                  <li>• QUICK_START.md guide</li>
                  <li>• Backend-specific README</li>
                  <li>• Drive-detection README</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

