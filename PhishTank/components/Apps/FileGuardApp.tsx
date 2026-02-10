
import React, { useState } from 'react';
import { X, FileText, FileCode, Image as ImageIcon, Trash2, Download, Shield } from 'lucide-react';

interface FileGuardAppProps {
  onBack: () => void;
  onAction: (bonus: number, desc: string) => void;
}

const FILES = [
    { name: "invoice_2024.pdf", type: "safe", icon: FileText },
    { name: "vacation_photo.jpg", type: "safe", icon: ImageIcon },
    { name: "bonus_payment.pdf.exe", type: "danger", icon: FileCode },
    { name: "system_update.bat", type: "danger", icon: FileCode },
    { name: "report_final.docx", type: "safe", icon: FileText },
    { name: "free_minecraft.msi", type: "danger", icon: FileCode },
    { name: "funny_cat.mov.exe", type: "danger", icon: FileCode },
    { name: "quarterly_earnings.xlsx", type: "safe", icon: FileText },
];

export const FileGuardApp: React.FC<FileGuardAppProps> = ({ onBack, onAction }) => {
  const [queue, setQueue] = useState(FILES);

  const handleAction = (file: any, action: 'keep' | 'delete') => {
      const isCorrect = (action === 'delete' && file.type === 'danger') || (action === 'keep' && file.type === 'safe');
      
      if (isCorrect) {
          onAction(50, `File Analyzed Correctly`);
      } else {
          onAction(-50, `File Analysis Failed`);
      }
      setQueue(prev => prev.filter(f => f.name !== file.name));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="pt-12 pb-4 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><Shield size={20} className="text-blue-400"/> FileGuard</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Pending Downloads</h2>
          
          <div className="space-y-4">
              {queue.length === 0 && <div className="text-center text-gray-500 py-10">No pending files.</div>}
              {queue.map((file) => (
                  <div key={file.name} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                              <file.icon size={20} className="text-gray-300"/>
                          </div>
                          <div className="min-w-0">
                              <p className="font-bold text-sm text-white truncate pr-2">{file.name}</p>
                              <p className="text-xs text-gray-500">2.4 MB</p>
                          </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => handleAction(file, 'keep')}
                            className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                          >
                              <Download size={18}/>
                          </button>
                          <button 
                            onClick={() => handleAction(file, 'delete')}
                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                              <Trash2 size={18}/>
                          </button>
                      </div>
                  </div>
              ))}
          </div>
          
          <div className="mt-8 bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
              <h3 className="text-blue-400 font-bold text-sm mb-1">Analyst Tip</h3>
              <p className="text-blue-200/70 text-xs leading-relaxed">
                  Watch out for "Double Extensions" like <strong>.pdf.exe</strong>. These are executable programs disguised as documents.
              </p>
          </div>
      </div>
    </div>
  );
};
