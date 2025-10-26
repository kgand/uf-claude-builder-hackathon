"use client"

import type React from "react"
import { type Msg, MsgRole, BotState } from "../../lib/types"
import ActionStep from "./ActionStep"

interface ChatMessageProps {
  message: Msg
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MsgRole.User

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-xl p-5 shadow-sm ${
          isUser ? "bg-gradient-to-br from-uf-orange-50 to-uf-orange-100 text-uf-gray-800 border border-uf-orange-200" : "bg-white border border-uf-gray-200"
        }`}
        style={{ width: "auto", maxWidth: "100%" }}
      >
        {/* User message or agent plain response */}
        <div className="whitespace-pre-wrap mb-3">{message.content}</div>

        {/* bot actions with steps */}
        {!isUser && message.botActions && message.botActions.length > 0 && (
          <div className="mt-4">
            {/* render action header */}
            {message.botActions.map((action, index) => (
              <div key={index} className="mb-3 p-3 bg-gradient-to-r from-uf-blue-50 to-uf-orange-50 rounded-lg border border-uf-blue-200">
                <div className="font-semibold text-uf-gray-900">{action.title}</div>
                {action.desc && <div className="text-sm text-uf-gray-700 mt-1">{action.desc}</div>}
              </div>
            ))}
          </div>
        )}

        {/* pics as individual steps */}
        {!isUser && message.pics && message.pics.length > 0 && (
          <div className="mt-4 flex flex-col items-start">
            {message.pics.map((pic, index) => (
              <ActionStep
                key={index}
                title={`Step ${pic.step}`}
                screenshot={pic}
                status={
                  index === message.pics!.length - 1 &&
                  message.botActions &&
                  message.botActions[0]?.status === BotState.Working
                    ? "Working..."
                    : "Complete"
                }
                isLoading={
                  index === message.pics!.length - 1 &&
                  message.botActions &&
                  (message.botActions[0]?.status === BotState.Thinking ||
                    message.botActions[0]?.status === BotState.Working)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
