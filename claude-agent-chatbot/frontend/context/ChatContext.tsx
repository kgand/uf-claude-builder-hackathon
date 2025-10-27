"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Convo, 
  Msg, 
  MsgRole, 
  BotState, 
  Pic, 
  BotAction, 
  WSMessage 
} from '../lib/types';
import { getWebSocketClient } from '../lib/websocket';

interface ChatContextType {
  convos: Convo[];
  currentConvo: Convo | null;
  botStatus: BotState;
  currentPics: Pic[];
  currentAction: BotAction | null;
  isConnected: boolean;
  sendMsg: (content: string) => void;
  newConvo: () => void;
  selectConvo: (convoId: string) => void;
  deleteConvo: (convoId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [convos, setConvos] = useState<Convo[]>([]);
  const [currentConvo, setCurrentConvo] = useState<Convo | null>(null);
  const [botStatus, setBotStatus] = useState<BotState>(BotState.Idle);
  const [currentPics, setCurrentPics] = useState<Pic[]>([]);
  const [currentAction, setCurrentAction] = useState<BotAction | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleWSMessage = (data: WSMessage) => {
    console.log('ws message:', data);
    if (data.screenshot_url && data.step !== undefined) {
      const newPic: Pic = {
        url: data.screenshot_url,
        base64: data.screenshot_base64,
        step: data.step,
        desc: data.status,
      };
      
      setCurrentPics(prev => [...prev, newPic]);
      
      // update action status
      setCurrentAction(prev => {
        if (prev) {
          return {
            ...prev,
            status: BotState.Working,
          };
        }
        return prev;
      });
    }

    if (data.error) {
      setBotStatus(BotState.Error);
      // save error with current action/pics
      addBotMsg(`Error: ${data.error}`, 
        currentAction ? [currentAction] : [], 
        [...currentPics]
      );
    }

    if (data.done && data.result) {
      setBotStatus(BotState.Done);
      // save result with action/pics
      addBotMsg(data.result, 
        currentAction ? [currentAction] : [], 
        [...currentPics]
      );
    }
  };

  // init with default convo and ws
  useEffect(() => {
    const stored = localStorage.getItem('c-drive-convos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Convo[];
        setConvos(parsed);
        if (parsed.length > 0) {
          setCurrentConvo(parsed[0]);
        } else {
          newConvo();
        }
      } catch (error) {
        console.error('parse error:', error);
        newConvo();
      }
    } else {
      newConvo();
    }

    // init ws client
    const wsClient = getWebSocketClient(
      'ws://localhost:8000/ws/bot',
      handleWSMessage,
      () => setIsConnected(true),
      () => {
        setIsConnected(false);
        setBotStatus(BotState.Idle);
      },
      (error) => {
        console.error('ws error:', error);
        setBotStatus(BotState.Error);
      }
    );
    
    // connect now
    wsClient.connect();
    
    // reconnect logic
    const reconnectInterval = setInterval(() => {
      if (!wsClient.isConnected()) {
        console.log('reconnecting...');
        wsClient.connect();
      }
    }, 5000);
    
    // cleanup
    return () => {
      clearInterval(reconnectInterval);
      wsClient.disconnect();
    };
  }, []);

  // save convos to storage
  useEffect(() => {
    if (convos.length > 0) {
      localStorage.setItem('c-drive-convos', JSON.stringify(convos));
    }
  }, [convos]);

  const newConvo = () => {
    const newConvo: Convo = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConvos(prev => [newConvo, ...prev]);
    setCurrentConvo(newConvo);
    setCurrentPics([]);
    setCurrentAction(null);
    setBotStatus(BotState.Idle);
  };

  const selectConvo = (convoId: string) => {
    const convo = convos.find(c => c.id === convoId);
    if (convo) {
      setCurrentConvo(convo);
      setCurrentPics([]);
      setCurrentAction(null);
      setBotStatus(BotState.Idle);
    }
  };

  const deleteConvo = (convoId: string) => {
    setConvos(prev => prev.filter(c => c.id !== convoId));
    if (currentConvo?.id === convoId) {
      const remaining = convos.filter(c => c.id !== convoId);
      if (remaining.length > 0) {
        setCurrentConvo(remaining[0]);
      } else {
        newConvo();
      }
    }
  };

  const addUserMsg = (content: string) => {
    if (!currentConvo) return;
    
    const newMsg: Msg = {
      id: uuidv4(),
      role: MsgRole.User,
      content,
      timestamp: new Date(),
    };
    
    const updatedConvo: Convo = {
      ...currentConvo,
      messages: [...currentConvo.messages, newMsg],
      title: content.length > 30 ? `${content.substring(0, 30)}...` : content,
      updatedAt: new Date(),
    };
    
    setCurrentConvo(updatedConvo);
    setConvos(prev => prev.map(c => c.id === updatedConvo.id ? updatedConvo : c));
  };

  const addBotMsg = (content: string, botActions: BotAction[] = [], pics: Pic[] = []) => {
    if (!currentConvo) return;
    
    const newMsg: Msg = {
      id: uuidv4(),
      role: MsgRole.Bot,
      content,
      timestamp: new Date(),
      botActions: botActions.length > 0 ? [...botActions] : undefined,
      pics: pics.length > 0 ? [...pics] : undefined,
    };
    
    const updatedConvo: Convo = {
      ...currentConvo,
      messages: [...currentConvo.messages, newMsg],
      updatedAt: new Date(),
    };
    
    setCurrentConvo(updatedConvo);
    setConvos(prev => prev.map(c => c.id === updatedConvo.id ? updatedConvo : c));
  };

  const sendMsg = (content: string) => {
    if (!content.trim()) return;
    
    // add user msg
    addUserMsg(content);
    
    // set bot status
    setBotStatus(BotState.Thinking);
    setCurrentPics([]);
    
    // add thinking action
    const thinkingAction: BotAction = {
      title: 'Thinking...',
      status: BotState.Thinking,
    };
    setCurrentAction(thinkingAction);
    
    // get ws client
    const wsClient = getWebSocketClient();
    
    // send job to bot
    wsClient.sendMessage({ task: content });
    
    // update to working status
    setTimeout(() => {
      const initAction: BotAction = {
        title: 'Web Bot - Working',
        desc: 'Starting browser...',
        status: BotState.Working,
      };
      setCurrentAction(initAction);
      setBotStatus(BotState.Working);
    }, 1500);
  };

  const value = {
    convos,
    currentConvo,
    botStatus,
    currentPics,
    currentAction,
    isConnected,
    sendMsg,
    newConvo,
    selectConvo,
    deleteConvo,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};