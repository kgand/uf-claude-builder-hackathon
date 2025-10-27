import React, { useState } from 'react';
import { Loader2, ExternalLink, Image } from 'lucide-react';
import { Pic, BotState } from '../lib/types';

interface BrowserAgentContentProps {
  screenshots?: Pic[];
  status: BotState;
  url?: string;
  logs?: string[];
}

export const BrowserAgentContent: React.FC<BrowserAgentContentProps> = ({
  screenshots = [],
  status,
  url,
  logs = []
}) => {
  const [selectedIndex, setSelectedIndex] = useState(screenshots.length > 0 ? screenshots.length - 1 : 0);
  const latestScreenshot = screenshots.length > 0 ? screenshots[screenshots.length - 1] : null;
  const selectedScreenshot = screenshots[selectedIndex];

  return (
    <div className="space-y-4">
      {/* URL Bar */}
      {url && (
        <div className="bg-[#F2F2F2] rounded-md p-2 flex items-center gap-2">
          {status === BotState.Working ? (
            <Loader2 className="w-4 h-4 text-[#6B5A55] animate-spin" />
          ) : status === BotState.Done ? (
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
          ) : status === BotState.Error ? (
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
          )}
          <div className="flex-1 text-sm bg-white rounded px-2 py-1 text-[#2D2D2D] truncate font-mono">
            {url}
          </div>
          {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#6B5A55] hover:text-[#D97A4D]"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}

      {/* Screenshot Display */}
      {screenshots.length > 0 ? (
        <div className="space-y-3">
          {/* Main screenshot display */}
          <div className="rounded-lg overflow-hidden border border-[#E8E1D8]">
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
            <div className="text-xs text-[#6B5A55] p-2 bg-[#F9F5F1]">
              Step {selectedScreenshot.step} of {screenshots.length}
              {selectedScreenshot.description && ` - ${selectedScreenshot.description}`}
            </div>
          </div>

          {/* Thumbnail navigation for multiple screenshots */}
          {screenshots.length > 1 && (
            <div className="flex overflow-x-auto gap-2 pb-2">
              {screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`cursor-pointer border-2 rounded-md overflow-hidden flex-shrink-0 ${
                    index === selectedIndex ? "border-[#D97A4D]" : "border-[#E8E1D8]"
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
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center text-[#6B5A55]">
          {status === BotState.Working ? (
            <>
              <Loader2 className="w-8 h-8 mb-2 animate-spin" />
              <p>Loading page content...</p>
            </>
          ) : status === BotState.Error ? (
            <div className="text-red-500">Error loading content</div>
          ) : (
            <>
              <Image className="w-8 h-8 mb-2 text-[#E8E1D8]" />
              <p>No screenshots available</p>
            </>
          )}
        </div>
      )}

      {/* Browser Activity Logs */}
      {logs.length > 0 && (
        <div className="bg-[#F9F5F1] border border-[#E8E1D8] rounded-md p-3">
          <h3 className="font-medium text-[#2D2D2D] mb-2">Browser Activity</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto text-xs">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#6B5A55] font-mono whitespace-nowrap">
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="text-[#2D2D2D]">{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserAgentContent;