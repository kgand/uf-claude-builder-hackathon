"use client"

import type React from "react"
import { type BotAction, BotState, type Pic } from "../../lib/types"
import ActionStep from "./ActionStep"

interface AgentActionStatusProps {
  action: BotAction
  status: BotState
  screenshots: Pic[]
}

const AgentActionStatus: React.FC<AgentActionStatusProps> = ({ action, status, screenshots }) => {
  const getStatusText = () => {
    switch (status) {
      case BotState.Thinking:
        return "Thinking..."
      case BotState.Working:
        return "Working..."
      case BotState.Error:
        return "Error"
      case BotState.Done:
        return "Complete"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col items-start w-auto">
      {/* show action header */}
      <div className="mb-3 p-3 bg-gradient-to-r from-uf-blue-50 to-uf-orange-50 rounded-lg border border-uf-blue-200">
        <div className="font-semibold text-uf-gray-900">{action.title}</div>
        {action.desc && <div className="text-sm text-uf-gray-700 mt-1">{action.desc}</div>}
      </div>

      {/* show each pic as separate step */}
      {screenshots.map((pic, index) => (
        <ActionStep
          key={index}
          title={`Step ${pic.step}`}
          screenshot={pic}
          status={getStatusText()}
          isLoading={status === BotState.Thinking || status === BotState.Working}
        />
      ))}

      {/* no pics but still working */}
      {screenshots.length === 0 && (
        <div
          className="border border-uf-gray-200 rounded-xl p-4 bg-white shadow-sm"
          style={{ width: "fit-content", maxWidth: "100%" }}
        >
          <div className="flex items-center gap-3">
            {status === BotState.Thinking && (
              <div className="animate-pulse text-uf-orange-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 6V12L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <div className="font-semibold text-uf-gray-900">{action.title}</div>
            <div className="text-sm text-uf-orange-600 ml-auto font-medium">{getStatusText()}</div>
          </div>
          {status === BotState.Thinking && (
            <div className="space-y-2 mt-4">
              <div className="h-2 bg-gradient-to-r from-uf-orange-100 to-uf-orange-200 rounded animate-pulse w-3/4"></div>
              <div className="h-2 bg-gradient-to-r from-uf-orange-100 to-uf-orange-200 rounded animate-pulse w-1/2"></div>
              <div className="h-2 bg-gradient-to-r from-uf-orange-100 to-uf-orange-200 rounded animate-pulse w-5/6"></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AgentActionStatus
