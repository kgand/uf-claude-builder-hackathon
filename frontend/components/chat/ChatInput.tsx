"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { BotState } from '../../lib/types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const { agentStatus } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const isDisabled = agentStatus === BotState.Thinking || agentStatus === BotState.Working;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isDisabled 
              ? "Processing your request..." 
              : "Type your message..."
          }
          disabled={isDisabled}
          className="w-full p-4 border border-uf-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-uf-orange-500/30 focus:border-uf-orange-400 bg-white text-uf-gray-900 placeholder-uf-gray-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            !message.trim() || isDisabled
              ? 'bg-uf-gray-200 text-uf-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-uf-orange-500 to-uf-orange-600 text-white hover:from-uf-orange-600 hover:to-uf-orange-700 shadow-md hover:shadow-lg'
          }`}
        >
          Send
        </button>
      </form>
      <div className="text-xs text-uf-gray-500 mt-2 ml-1">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}

export default ChatInput;
