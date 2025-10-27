"use client";

import Link from "next/link";
import Image from "next/image";
import AuroraBackground from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AuroraBackground />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-screen">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/cdrive.png"
            alt="C-Drive Logo"
            width={120}
            height={120}
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Welcome Title */}
        <h1 className="text-6xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          Welcome to C-Drive!
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-300 text-center max-w-3xl mb-12 leading-relaxed">
          Experience the future of intelligent web automation and driver safety. 
          C-Drive combines powerful AI capabilities with real-time computer vision 
          to create a comprehensive system for automated web tasks and driver monitoring.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">AI-Powered Automation</h3>
            <p className="text-gray-400">
              Advanced web automation using Claude AI for intelligent task execution
            </p>
          </div>
          
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl mb-4">👁️</div>
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Driver Monitoring</h3>
            <p className="text-gray-400">
              Real-time computer vision for driver state detection and safety alerts
            </p>
          </div>
          
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Real-Time Processing</h3>
            <p className="text-gray-400">
              Live updates and instant feedback for all automation tasks
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/drive-detection">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50">
              Try it out!
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
