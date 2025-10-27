import React, { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Pic, BotState } from "../lib/types";
import { BrowserAgentContent } from "./BrowserAgentComponent";

interface AgentInvocationProps {
  title: string;
  agentType?: string;
  status?: "pending" | "in_progress" | "completed" | "failed";
  initiallyOpen?: boolean;
  screenshots?: Screenshot[];
}

export const AgentInvocation: React.FC<AgentInvocationProps> = ({
  title,
  agentType = "browser",
  status = "in_progress",
  initiallyOpen = false,
  screenshots = [],
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  // Agent type icon and color mapping
  const agentStyles = {
    "master": {
      icon: "👑",
      bgColor: "bg-[#F2E9E1]",
      textColor: "text-[#D97A4D]",
      hoverBg: "hover:bg-[#EAE0D5]",
      iconBg: "bg-[#D97A4D]",
      iconText: "text-white"
    },
    "browser": {
      icon: "🌐",
      bgColor: "bg-[#E6F7F1]",
      textColor: "text-[#2D9D78]",
      hoverBg: "hover:bg-[#D7F0E7]",
      iconBg: "bg-[#2D9D78]",
      iconText: "text-white"
    },
    "api": {
      icon: "🔌",
      bgColor: "bg-[#F6F2FF]",
      textColor: "text-[#7C3AED]",
      hoverBg: "hover:bg-[#EDE7F8]",
      iconBg: "bg-[#7C3AED]",
      iconText: "text-white"
    },
    "data": {
      icon: "📊",
      bgColor: "bg-[#FFF7E6]",
      textColor: "text-[#D97706]",
      hoverBg: "hover:bg-[#FBF0D9]",
      iconBg: "bg-[#D97706]",
      iconText: "text-white"
    }
  }[agentType] || { 
    icon: "🤖", 
    bgColor: "bg-[#F2E9E1]", 
    textColor: "text-[#6B5A55]",
    hoverBg: "hover:bg-[#EAE0D5]",
    iconBg: "bg-[#6B5A55]",
    iconText: "text-white"
  };

  // Status indicator
  const statusIndicator = () => {
    switch (status) {
      case "in_progress":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "completed":
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case "failed":
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-300" />;
    }
  };

  // Latest screenshot for display
  const latestScreenshot = screenshots.length > 0 ? screenshots[screenshots.length - 1] : null;

  return (
    <div className="mb-4 rounded-lg border border-[#E8E1D8] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 flex items-center justify-between text-left ${agentStyles.bgColor} ${agentStyles.hoverBg} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full ${agentStyles.iconBg} ${agentStyles.iconText} flex items-center justify-center text-xs`}>
            {agentStyles.icon}
          </div>
          <span className={`${agentStyles.textColor} font-medium`}>{title}</span>
          <div className={agentStyles.textColor}>
            {statusIndicator()}
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className={`w-4 h-4 ${agentStyles.textColor}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${agentStyles.textColor}`} />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white">
          <BrowserAgentContent 
            screenshots={screenshots}
            status={status === "in_progress" ? BotState.Working : 
                   status === "completed" ? BotState.Done :
                   status === "failed" ? BotState.Error : BotState.Idle}
          />
        </div>
      )}
    </div>
  );
};

export default AgentInvocation;