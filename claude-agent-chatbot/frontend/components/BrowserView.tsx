"use client"

import type React from "react"
import { useState } from "react"
import { type BotAction, BotState, type Pic } from "../lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Monitor, ImageIcon, List, X } from "lucide-react"

interface BrowserViewProps {
  action: BotAction | null
  status: BotState
  screenshots: Pic[]
}

const BrowserView: React.FC<BrowserViewProps> = ({ action, status, screenshots }) => {
  const [activeTab, setActiveTab] = useState("live")
  const latestScreenshot = screenshots.length > 0 ? screenshots[screenshots.length - 1] : null

  const isLoading = status === BotState.Thinking || status === BotState.Working

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Monitor size={18} className="text-amber-600" />
          <h2 className="font-medium text-gray-900">Browser View</h2>
          {isLoading && (
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <Loader2 size={14} className="animate-spin" />
              <span>{status === BotState.Thinking ? "thinking..." : "working..."}</span>
            </div>
          )}
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-gray-200">
          <TabsList className="bg-transparent border-b-0 p-0">
            <TabsTrigger
              value="live"
              className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
            >
              Live View
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
            >
              Screenshots
            </TabsTrigger>
            <TabsTrigger
              value="steps"
              className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2"
            >
              Steps
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Live View Tab */}
        <TabsContent value="live" className="flex-1 overflow-auto p-4 m-0 data-[state=inactive]:hidden">
          {latestScreenshot ? (
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
              {latestScreenshot.base64 ? (
                <img
                  src={`data:image/png;base64,${latestScreenshot.base64}`}
                  alt="Current browser view"
                  className="w-full object-contain"
                />
              ) : (
                <img
                  src={latestScreenshot.url || "/placeholder.svg"}
                  alt="Current browser view"
                  className="w-full object-contain"
                />
              )}
              <div className="p-3 border-t border-gray-200 text-sm text-gray-700">
                {latestScreenshot.description || `Step ${latestScreenshot.step}`}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Monitor size={48} className="mb-4 text-gray-300" />
              <p>No browser activity yet</p>
            </div>
          )}
        </TabsContent>

        {/* Screenshots Gallery Tab */}
        <TabsContent value="gallery" className="flex-1 overflow-auto p-4 m-0 data-[state=inactive]:hidden">
          {screenshots.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  {screenshot.base64 ? (
                    <img
                      src={`data:image/png;base64,${screenshot.base64}`}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <img
                      src={screenshot.url || "/placeholder.svg"}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">Step {screenshot.step}</div>
                    <div className="text-sm text-gray-700 truncate">
                      {screenshot.description || `Screenshot ${index + 1}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ImageIcon size={48} className="mb-4 text-gray-300" />
              <p>No screenshots available</p>
            </div>
          )}
        </TabsContent>

        {/* Steps Tab */}
        <TabsContent value="steps" className="flex-1 overflow-auto p-4 m-0 data-[state=inactive]:hidden">
          {action ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900">{action.title}</h3>
                {action.description && <p className="text-sm text-gray-700 mt-1">{action.description}</p>}
              </div>

              <div className="relative pl-6 border-l-2 border-amber-200 space-y-6 py-2">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-amber-500 border-4 border-white"></div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 ml-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        {screenshot.description || `Step ${screenshot.step}`}
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {screenshot.base64 ? (
                          <img
                            src={`data:image/png;base64,${screenshot.base64}`}
                            alt={`Step ${screenshot.step}`}
                            className="w-full object-contain"
                          />
                        ) : (
                          <img
                            src={screenshot.url || "/placeholder.svg"}
                            alt={`Step ${screenshot.step}`}
                            className="w-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-gray-300 border-4 border-white animate-pulse"></div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 ml-4">
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-amber-600" />
                        <div className="text-sm font-medium text-gray-900">
                          {status === BotState.Thinking ? "thinking..." : "working..."}
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="h-2 bg-gray-100 rounded animate-pulse w-3/4"></div>
                        <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <List size={48} className="mb-4 text-gray-300" />
              <p>No steps available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BrowserView
