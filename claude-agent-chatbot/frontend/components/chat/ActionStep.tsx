"use client"

import type React from "react"
import { useState } from "react"
import type { Pic } from "../../lib/types"
import { FiChevronDown, FiChevronRight } from "react-icons/fi"

interface ActionStepProps {
  title: string
  description?: string
  screenshot: Pic // single pic
  status: string
  isLoading?: boolean
}

const ActionStep: React.FC<ActionStepProps> = ({ title, description, screenshot, status, isLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div
      className="border border-uf-gray-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm"
      style={{ width: "fit-content", maxWidth: "100%" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-uf-orange-50 w-full transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-uf-orange-600">{isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}</div>

        {isLoading && (
          <div className="animate-spin mr-2 text-uf-orange-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        <div className="font-semibold text-uf-gray-900">{title || `Step ${screenshot.step}`}</div>

        {status && <div className="text-xs text-uf-orange-600 ml-auto font-medium">{status}</div>}
      </div>

      {/* content */}
      {isExpanded && (
        <div className="p-4 border-t border-uf-gray-100">
          {description && <div className="text-sm text-uf-gray-700 mb-3">{description}</div>}

          <div className="border border-uf-gray-200 rounded-lg overflow-hidden shadow-sm" style={{ maxWidth: "400px" }}>
            {screenshot.base64 ? (
              <img
                src={`data:image/png;base64,${screenshot.base64}`}
                alt={`pic step ${screenshot.step}`}
                className="w-full object-contain"
              />
            ) : (
              <img
                src={screenshot.url || "/placeholder.svg"}
                alt={`pic step ${screenshot.step}`}
                className="w-full object-contain"
              />
            )}
            <div className="text-xs text-uf-gray-600 p-3 bg-gradient-to-r from-uf-blue-50 to-uf-orange-50 font-medium">
              Step {screenshot.step}
              {screenshot.desc && ` - ${screenshot.desc}`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionStep
