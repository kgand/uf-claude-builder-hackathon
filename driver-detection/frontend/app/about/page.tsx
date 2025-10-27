"use client";

import AuroraBackground from "@/components/ui/aurora-background";

export default function About() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AuroraBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              About C-Drive
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <section className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">What is C-Drive?</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                C-Drive is an innovative AI-powered platform that combines intelligent web automation 
                with advanced driver safety monitoring. Built for the Claude Builder Hackathon, 
                C-Drive leverages cutting-edge AI models and computer vision technologies to deliver 
                comprehensive automation and safety solutions.
              </p>
            </section>

            <section className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">Web Automation System</h2>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                Our backend leverages Claude AI through the Anthropic API to enable intelligent 
                web automation. The system uses:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>FastAPI for robust API endpoints</li>
                <li>LangGraph for orchestrating complex AI workflows</li>
                <li>Browser-Use and Playwright for browser automation</li>
                <li>WebSocket support for real-time communication</li>
                <li>Screenshot capture and storage for task documentation</li>
              </ul>
            </section>

            <section className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">Driver Safety Detection</h2>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                The computer vision system monitors driver attention in real-time using:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>MediaPipe for face and landmark detection</li>
                <li>Eye Aspect Ratio (EAR) analysis for drowsiness detection</li>
                <li>Gaze tracking for attention monitoring</li>
                <li>Head pose estimation for distraction detection</li>
                <li>PERCLOS scoring for fatigue assessment</li>
              </ul>
            </section>

            <section className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">Modern Frontend</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Built with Next.js 15, React 18, and Tailwind CSS, the frontend provides a 
                beautiful, responsive interface with real-time updates, dark mode support, 
                and seamless integration with both backend services. The UI features animated 
                backgrounds, modern shadcn components, and intuitive navigation for the best user experience.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Technologies Used</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Next.js 15 & React 18</li>
                  <li>• FastAPI & Python</li>
                  <li>• Claude AI (Anthropic)</li>
                  <li>• MediaPipe & OpenCV</li>
                  <li>• Playwright & Browser-Use</li>
                </ul>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">Key Features</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• AI-powered web automation</li>
                  <li>• Real-time driver monitoring</li>
                  <li>• WebSocket live updates</li>
                  <li>• Screenshot documentation</li>
                  <li>• Modern, responsive UI</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

