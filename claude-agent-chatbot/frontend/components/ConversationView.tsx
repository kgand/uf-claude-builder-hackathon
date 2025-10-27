"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useChat } from "../context/ChatContext"
import { MessageRole, type Message } from "../lib/types"
import { User, Bot, ArrowRight } from "lucide-react"

const ConversationView: React.FC = () => {
  const { currentConvo } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConvo?.messages])

  if (!currentConvo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-uf-gray-500 p-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-uf-orange-100 to-uf-blue-100 flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-10 h-10 text-uf-orange-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-uf-gray-900 mb-2">Welcome to C-Drive</h2>
        <p className="text-center max-w-md mb-8 text-uf-gray-600">
          Ask me to browse the web, analyze content, or help you with research. I can navigate websites and show you
          what I find.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { title: "Browse a website", description: "I can visit websites and show you what I find" },
            { title: "Research a topic", description: "I can gather information from multiple sources" },
            { title: "Compare products", description: "I can help you evaluate different options" },
            { title: "Find information", description: "I can search for specific details online" },
          ].map((suggestion, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-uf-gray-200 hover:border-uf-orange-300 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <h3 className="font-semibold text-uf-gray-900 mb-2">{suggestion.title}</h3>
              <p className="text-sm text-uf-gray-600">{suggestion.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-uf-gray-200 bg-gradient-to-r from-uf-blue-50 to-uf-orange-50">
        <h2 className="text-lg font-semibold text-uf-gray-900">{currentConvo.title || "New Analysis"}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {currentConvo.messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

interface MessageItemProps {
  message: Message
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === MessageRole.User

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-3xl ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-4" : "mr-4"}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
              isUser ? "bg-gradient-to-br from-uf-orange-100 to-uf-orange-200" : "bg-gradient-to-br from-uf-blue-100 to-uf-blue-200"
            }`}
          >
            {isUser ? <User size={18} className="text-uf-orange-700" /> : <Bot size={18} className="text-uf-blue-700" />}
          </div>
        </div>

        {/* Message content */}
        <div className={`rounded-xl p-5 shadow-sm ${isUser ? "bg-gradient-to-br from-uf-orange-50 to-uf-orange-100 text-uf-gray-800 border border-uf-orange-200" : "bg-white border border-uf-gray-200"}`}>
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Action summary (if any) */}
          {!isUser && message.agentActions && message.agentActions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-uf-gray-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-uf-blue-700 mb-2">
                <ArrowRight size={16} />
                <span>Actions Performed</span>
              </div>
              <div className="space-y-2">
                {message.agentActions.map((action, index) => (
                  <div key={index} className="text-sm bg-uf-blue-50 p-2 rounded-lg">
                    <span className="font-semibold text-uf-blue-800">{action.title}</span>
                    {action.description && <span className="text-uf-gray-600"> - {action.description}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationView
