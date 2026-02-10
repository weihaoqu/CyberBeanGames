import React from 'react';
import { CheckCircle2, XCircle, DollarSign } from 'lucide-react';

interface FeedbackModalProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  amount: number; // Positive or negative
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ type, title, message, amount, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-6 flex flex-col items-center text-center transform transition-all scale-100">
        
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          {type === 'success' ? (
            <CheckCircle2 size={48} className="text-green-600" />
          ) : (
            <XCircle size={48} className="text-red-600" />
          )}
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {message}
        </p>

        <div className={`flex items-center gap-1 font-bold text-xl mb-8 ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {amount >= 0 ? '+' : ''}{amount} <DollarSign size={20} strokeWidth={3} />
        </div>

        <button 
          onClick={onClose}
          className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform ${type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          Continue
        </button>

      </div>
    </div>
  );
};