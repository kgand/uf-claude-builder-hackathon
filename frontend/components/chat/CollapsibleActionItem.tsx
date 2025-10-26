"use client"

import type React from "react"
import { useState } from "react"
import { FiChevronDown, FiChevronUp, FiCircle } from "react-icons/fi"
import type { Screenshot } from "../../lib/types"
import ScreenshotGallery from "./ScreenshotGallery"

interface CollapsibleActionItemProps {
  title: string
  icon?: React.ReactNode
  isActive?: boolean
  isLoading?: boolean
  screenshots?: Screenshot[]
  children?: React.ReactNode
}

const CollapsibleActionItem: React.FC<CollapsibleActionItemProps> = ({
  title,
  icon,
  isActive = false,
  isLoading = false,
  screenshots = [],
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mb-3">
      <div
        className="flex items-center gap-2 py-2 px-2 text-gray-700 cursor-pointer hover:bg-amber-50 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-center w-6 h-6">
          {icon ||
            (isLoading ? (
              <div className="animate-spin text-amber-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              <FiCircle className={`w-4 h-4 ${isActive ? "text-amber-500" : "text-gray-500"}`} />
            ))}
        </div>
        <div className="flex-1 text-sm">{title}</div>
        <div className="text-gray-500">
          {isOpen ? <FiChevronDown className="w-5 h-5" /> : <FiChevronUp className="w-5 h-5" />}
        </div>
      </div>

      {isOpen && (
        <div className="pl-8 pr-2 py-2 mt-1">
          {screenshots && screenshots.length > 0 && (
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <ScreenshotGallery screenshots={screenshots} />
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  )
}

export default CollapsibleActionItem
