
import React, { useState } from 'react';
import { Message } from '../../types';
import { X, User, ChevronRight } from 'lucide-react';

interface MessagesAppProps {
  messages: Message[];
  onBack: () => void;
  onAction: (id: string, action: 'block' | 'reply') => void;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({ messages, onBack, onAction }) => {
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const smsList = messages.filter(m => m.type === 'sms').sort((a, b) => b.timestamp - a.timestamp);

  const activeMessage = messages.find(m => m.id === selectedMsgId);

  // Detail View
  if (activeMessage) {
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Thread Header */}
            <div className="pt-12 pb-2 px-4 bg-gray-100/80 backdrop-blur-md border-b border-gray-300 sticky top-0 z-10 flex items-center gap-2">
                <button onClick={() => setSelectedMsgId(null)} className="flex items-center text-blue-500">
                    <X size={20} /> <span className="text-base ml-1">Back</span>
                </button>
                <div className="flex flex-col items-center flex-1 pr-8">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                        {activeMessage.sender.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{activeMessage.sender}</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                <div className="flex justify-center">
                    <span className="text-[10px] text-gray-400 font-medium">Today {new Date(activeMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                
                {/* Incoming Message Bubble */}
                <div className="flex justify-start">
                    <div className="max-w-[80%] bg-gray-200 rounded-2xl rounded-tl-none px-4 py-2 text-black text-sm relative">
                        {activeMessage.fullContent || activeMessage.content}
                    </div>
                </div>

                {/* User Response Bubble (if replied) */}
                {activeMessage.replied && (
                     <div className="flex justify-end">
                        <div className={`max-w-[80%] rounded-2xl rounded-tr-none px-4 py-2 text-white text-sm ${activeMessage.replyAction === 'block' ? 'bg-gray-500' : 'bg-blue-500'}`}>
                            {activeMessage.replyAction === 'block' ? "Blocked & Reported to Carrier 3370." : "Sure, sending info now."}
                        </div>
                     </div>
                )}
            </div>

            {/* Input Area */}
            {!activeMessage.replied ? (
                <div className="p-4 bg-gray-100 border-t border-gray-200">
                    <div className="flex gap-2 mb-2">
                         <button onClick={() => onAction(activeMessage.id, 'block')} className="flex-1 bg-red-100 text-red-600 py-3 rounded-lg text-xs font-bold shadow-sm">Report Junk</button>
                         <button onClick={() => onAction(activeMessage.id, 'reply')} className="flex-1 bg-blue-100 text-blue-600 py-3 rounded-lg text-xs font-bold shadow-sm">Reply Safe</button>
                    </div>
                </div>
            ) : (
                <div className="p-4 text-center text-gray-400 text-xs">Messaging Disabled</div>
            )}
        </div>
    );
  }

  // List View
  return (
    <div className="flex flex-col h-full bg-white text-black">
      <div className="pt-12 pb-2 px-4 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between">
        <button onClick={onBack} className="text-blue-500 text-sm"><X size={24} /></button>
        <h1 className="text-lg font-bold">Messages</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {smsList.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">No messages</div>
        ) : (
          smsList.map((msg) => (
            <div 
                key={msg.id} 
                onClick={() => setSelectedMsgId(msg.id)}
                className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer active:bg-gray-200 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg">
                 {msg.sender.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                   <span className="font-bold text-sm truncate">{msg.sender}</span>
                   <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-1">
                    <p className="text-gray-500 text-sm truncate leading-snug">
                        {msg.content}
                    </p>
                    <ChevronRight size={14} className="text-gray-300 ml-auto flex-shrink-0" />
                </div>
              </div>
              {msg.replied && (
                  <div className={`w-3 h-3 rounded-full ${msg.replyAction === 'block' ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
              )}
              {!msg.replied && (
                   <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
