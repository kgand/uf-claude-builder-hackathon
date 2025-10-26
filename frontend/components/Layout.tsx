"use client"

import type React from "react"
import { useChat } from "../context/ChatContext"
import CommandBar from "./CommandBar"
import BrowserView from "./BrowserView"
import Sidebar from "./Sidebar"
import { BotState } from "../lib/types"

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { agentStatus, currentAction, currentScreenshots } = useChat()
  const isAgentActive = agentStatus === BotState.Thinking || agentStatus === BotState.Working

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Split view when agent is active */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat/conversation area - takes full width when agent not active */}
          <div className={`flex flex-col ${isAgentActive ? "w-1/2" : "w-full"} h-full transition-all duration-300`}>
            {children}
          </div>

          {/* Browser view - only visible when agent is active */}
          {isAgentActive && (
            <div className="w-1/2 h-full border-l border-gray-200 bg-white transition-all duration-300 ease-in-out">
              <BrowserView action={currentAction} status={agentStatus} screenshots={currentScreenshots} />
            </div>
          )}
        </div>

        {/* Command bar at bottom */}
        <CommandBar />
      </div>
    </div>
  )
}

export default Layout
