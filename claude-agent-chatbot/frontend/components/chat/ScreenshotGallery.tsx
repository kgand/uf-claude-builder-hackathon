"use client"

import type React from "react"
import { useState } from "react"
import type { Screenshot } from "../../lib/types"

interface ScreenshotGalleryProps {
  screenshots: Screenshot[]
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots }) => {
  const [selectedIndex, setSelectedIndex] = useState(screenshots.length - 1)
  const selectedScreenshot = screenshots[selectedIndex]

  return (
    <div className="p-3 max-w-400px">
      {/* Main screenshot display */}
      <div className="rounded-lg overflow-hidden mb-3 bg-gray-900">
        {selectedScreenshot.base64 ? (
          <img
            src={`data:image/png;base64,${selectedScreenshot.base64}`}
            alt={`Screenshot step ${selectedScreenshot.step}`}
            className="w-full object-contain"
          />
        ) : (
          <img
            src={selectedScreenshot.url || "/placeholder.svg"}
            alt={`Screenshot step ${selectedScreenshot.step}`}
            className="w-full object-contain"
          />
        )}
      </div>

      {/* Thumbnail navigation */}
      {screenshots.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`cursor-pointer border-2 rounded-md overflow-hidden flex-shrink-0 ${
                index === selectedIndex ? "border-amber-500" : "border-gray-700"
              }`}
            >
              {screenshot.base64 ? (
                <img
                  src={`data:image/png;base64,${screenshot.base64}`}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={60}
                  className="object-cover w-20 h-14"
                />
              ) : (
                <img
                  src={screenshot.url || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={60}
                  className="object-cover w-20 h-14"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step indicator */}
      <div className="text-xs text-gray-400 mt-1">
        Step {selectedScreenshot.step} of {screenshots.length}
        {selectedScreenshot.description && ` - ${selectedScreenshot.description}`}
      </div>
    </div>
  )
}

export default ScreenshotGallery
