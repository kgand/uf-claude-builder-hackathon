"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useChat } from "../../context/ChatContext"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"
import AgentActionStatus from "./AgentActionStatus"

const ChatContainer: React.FC = () => {
  const { currentConvo, botStatus, currentAction, currentPics, isConnected, sendMsg, newConvo } =
    useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // scroll to bottom on msg change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConvo?.messages])

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-uf-gray-50 to-white">
      {/* header - commented out for now */}
      {/* <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium text-gray-900">Bot Interface</h2>
          {isConnected && (
            <div className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-500">Connected</span>
            </div>
          )}
        </div>
        <button
          className="px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded-md text-sm text-gray-800 border border-amber-200"
          onClick={newConvo}
        >
          New Chat
        </button>
      </div> */}

      {/* messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-uf-gray-50 to-white">
        {currentConvo?.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* current bot status if active */}
        {currentAction && (
          <AgentActionStatus action={currentAction} status={botStatus} screenshots={currentPics} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* input area */}
      <div className="p-6 border-t border-uf-gray-200 bg-white shadow-lg">
        <ChatInput onSendMessage={sendMsg} />
      </div>
    </div>
  )
}

export default ChatContainer
