"use client"

import type React from "react"
import { useChat } from "../context/ChatContext"
import { Plus, MessageSquare, History, Star, Settings, ChevronRight } from "lucide-react"

const Sidebar: React.FC = () => {
  const { convos, currentConvo, newConvo, selectConvo } = useChat()

  // Group convos by date (today, yesterday, older)
  const starredChats = convos.filter((convo) => convo.isStarred)
  const recentChats = convos.filter((convo) => !convo.isStarred)

  return (
    <div className="w-64 h-full bg-white border-r border-uf-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-uf-gray-200 bg-gradient-to-r from-uf-blue-500 to-uf-orange-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-white">C-Drive</h1>
        </div>
        <button className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/20">
          <Settings size={18} />
        </button>
      </div>

      {/* New chat button */}
      <div className="p-4">
        <button
          onClick={newConvo}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-uf-orange-50 to-uf-orange-100 hover:from-uf-orange-100 hover:to-uf-orange-200 text-uf-orange-800 rounded-xl transition-all duration-200 border border-uf-orange-200 hover:border-uf-orange-300 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Plus size={18} />
            <span className="font-medium">New Analysis</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Chat lists */}
      <div className="flex-1 overflow-y-auto">
        {/* Starred chats */}
        {starredChats.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-uf-gray-600 uppercase tracking-wide">
              <Star size={14} />
              <span>Starred</span>
            </div>
            <div className="space-y-1 px-2">
              {starredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectConvo(chat.id)}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg text-left transition-colors ${
                    currentConvo?.id === chat.id ? "bg-uf-orange-50 text-uf-orange-800 border border-uf-orange-200" : "text-uf-gray-700 hover:bg-uf-orange-50 hover:border hover:border-uf-orange-200"
                  }`}
                >
                  <MessageSquare size={16} />
                  <span className="truncate text-sm">{chat.title || "New Analysis"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent chats */}
        <div>
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-uf-gray-600 uppercase tracking-wide">
            <History size={14} />
            <span>Recent</span>
          </div>
          <div className="space-y-1 px-2">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectConvo(chat.id)}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg text-left transition-colors ${
                    currentConvo?.id === chat.id ? "bg-uf-orange-50 text-uf-orange-800 border border-uf-orange-200" : "text-uf-gray-700 hover:bg-uf-orange-50 hover:border hover:border-uf-orange-200"
                  }`}
                >
                  <MessageSquare size={16} />
                  <span className="truncate text-sm">{chat.title || "New Analysis"}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-uf-gray-500">No recent analyses</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
