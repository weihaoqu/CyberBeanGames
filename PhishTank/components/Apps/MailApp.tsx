
import React, { useState } from 'react';
import { Message } from '../../types';
import { X, Mail, AlertTriangle, Archive, Trash2, Reply } from 'lucide-react';

interface MailAppProps {
  messages: Message[];
  onBack: () => void;
  onAction: (id: string, action: 'block' | 'reply') => void;
}

export const MailApp: React.FC<MailAppProps> = ({ messages, onBack, onAction }) => {
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const mailList = messages.filter(m => m.type === 'email').sort((a, b) => b.timestamp - a.timestamp);

  const activeMessage = messages.find(m => m.id === selectedMsgId);

  if (activeMessage) {
      return (
          <div className="flex flex-col h-full bg-white text-black">
              {/* Detail Header */}
              <div className="pt-12 pb-2 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <button onClick={() => setSelectedMsgId(null)} className="flex items-center text-blue-500">
                      <X size={20} /> <span className="text-base">Inbox</span>
                  </button>
                  <div className="flex gap-4 text-blue-500">
                      <Trash2 size={20} />
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                  <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold leading-tight">{activeMessage.subject}</h2>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                           {activeMessage.sender.charAt(0)}
                       </div>
                       <div>
                           <div className="font-bold text-sm">{activeMessage.sender}</div>
                           <div className="text-xs text-gray-500">To: Me &lt;target@cyberos.com&gt;</div>
                       </div>
                       <div className="ml-auto text-xs text-gray-400">
                           {new Date(activeMessage.timestamp).toLocaleDateString()}
                       </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                      {activeMessage.fullContent || activeMessage.content}
                  </div>

                  {!activeMessage.replied && (
                      <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-3">Security Action</p>
                          <div className="flex gap-3">
                            <button 
                                onClick={() => onAction(activeMessage.id, 'block')}
                                className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-200 transition-colors"
                            >
                                <AlertTriangle size={16}/> Report Phishing
                            </button>
                            <button 
                                onClick={() => onAction(activeMessage.id, 'reply')}
                                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                            >
                                <Archive size={16}/> Mark Legit
                            </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-white text-black">
      <div className="pt-12 pb-2 px-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <button onClick={onBack} className="flex items-center text-blue-500">
            <X size={24} />
            </button>
         </div>
         <h1 className="text-lg font-semibold">Inbox</h1>
         <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <h2 className="px-4 py-2 font-bold text-2xl">Inbox</h2>
        {mailList.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">No Mail</div>
        ) : (
          mailList.map((msg) => (
            <div key={msg.id} onClick={() => setSelectedMsgId(msg.id)} className="border-b border-gray-100 px-4 py-3 active:bg-gray-100 transition-colors cursor-pointer relative">
              <div className="flex justify-between items-start mb-1">
                 <span className="font-bold text-base truncate pr-2">{msg.sender}</span>
                 <span className="text-gray-400 text-xs whitespace-nowrap">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="text-sm font-medium mb-1 truncate">{msg.subject}</div>
              <div className="text-gray-500 text-sm line-clamp-2 mb-1">{msg.content}</div>
              
              {msg.replied && (
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${msg.isScam ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                       {msg.isScam ? 'REPORTED' : 'SAFE'}
                   </span>
              )}
              {!msg.replied && <div className="absolute top-4 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
