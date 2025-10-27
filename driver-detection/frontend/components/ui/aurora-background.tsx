"use client";
import React from "react";

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 blur-[120px]">
          {/* Animated gradient orbs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" style={{ animation: "aurora 20s ease-in-out infinite" }}></div>
          <div className="absolute top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse" style={{ animation: "aurora 25s ease-in-out infinite" }}></div>
          <div className="absolute -bottom-40 left-40 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse" style={{ animation: "aurora 30s ease-in-out infinite" }}></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes aurora {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          25% {
            transform: translate(50px, 50px) scale(1.1);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50px, 100px) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translate(50px, -50px) scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

