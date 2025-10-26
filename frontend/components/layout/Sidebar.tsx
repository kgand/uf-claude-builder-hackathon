import React from 'react';
import { useChat } from '../../context/ChatContext';
import { FiPlus, FiMessageSquare } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const { convos, currentConvo, newConvo, selectConvo } = useChat();

  return (
    <aside className="w-64 h-full bg-white border-r border-uf-gray-200 flex flex-col">
      <div className="flex gap-2 p-4 border-b border-uf-gray-200 bg-gradient-to-r from-uf-blue-500 to-uf-orange-500">
        <svg className="mt-0.5 w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h1 className="text-xl text-white font-bold">C-Drive</h1>
      </div>

      <div className="p-2">
        <button
          onClick={newConvo}
          className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-uf-orange-50 transition-colors border border-uf-orange-200 hover:border-uf-orange-300"
        >
          <FiPlus className="text-uf-orange-600" />
          <span className="text-uf-gray-800 font-medium">Start New Chat</span>
        </button>
      </div>

      <div className="p-3 text-sm font-semibold text-uf-gray-700 uppercase tracking-wide">
        <h2>Starred</h2>
      </div>

      <div className="px-2">
        <div
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-uf-blue-50 transition-colors cursor-pointer border border-uf-blue-100 hover:border-uf-blue-200"
        >
          <FiMessageSquare className="text-uf-blue-600" />
          <span className="text-uf-gray-800 font-medium">Welcome to C-Drive</span>
        </div>
      </div>

      <div className="p-3 text-sm font-semibold text-uf-gray-700 uppercase tracking-wide">
        <h2>Recent Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {convos.map((convo) => (
          <div
            key={convo.id}
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-uf-orange-50 transition-colors cursor-pointer border ${
              currentConvo?.id === convo.id 
                ? 'bg-uf-orange-50 border-uf-orange-200' 
                : 'border-transparent hover:border-uf-orange-200'
            }`}
            onClick={() => selectConvo(convo.id)}
          >
            <FiMessageSquare className="text-uf-orange-600" />
            <span className="truncate text-uf-gray-800 font-medium">{convo.title || 'New Chat'}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
