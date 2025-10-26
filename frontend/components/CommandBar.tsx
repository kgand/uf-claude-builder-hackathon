"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "../context/ChatContext"
import { BotState } from "../lib/types"
import { Send, Paperclip, Sparkles, X, Loader2 } from "lucide-react"

const CommandBar: React.FC = () => {
  const [message, setMessage] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const { agentStatus, sendMessage } = useChat()
  const inputRef = useRef<HTMLInputElement>(null)

  const isDisabled = agentStatus === BotState.Thinking || agentStatus === BotState.Working

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isDisabled) {
      sendMessage(message)
      setMessage("")
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === "Escape") {
      setIsExpanded(false)
    }
  }

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {isExpanded ? (
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isDisabled ? "Processing your request..." : "Type your command or question..."}
                disabled={isDisabled}
                className="flex-1 p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600" disabled={isDisabled}>
                  <Paperclip size={18} />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim() || isDisabled}
                  className={`p-2 rounded-full ${
                    !message.trim() || isDisabled ? "text-gray-400" : "text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-text hover:border-amber-300 transition-colors"
          >
            <div className="text-gray-500">Type a command or ask a question...</div>
            <div className="flex items-center gap-2">
              {isDisabled ? (
                <div className="animate-spin text-amber-600">
                  <Loader2 size={18} />
                </div>
              ) : (
                <Sparkles size={18} className="text-amber-600" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommandBar
