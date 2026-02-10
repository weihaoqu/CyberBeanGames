
import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../../types';
import { X, CheckCircle2, XCircle, BrainCircuit, AlertTriangle } from 'lucide-react';
import { generateQuizQuestion } from '../../services/geminiService';

interface QuizAppProps {
  onBack: () => void;
  onWin: (amount: number) => void;
}

export const QuizApp: React.FC<QuizAppProps> = ({ onBack, onWin }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const historyRef = useRef<string[]>([]);

  const loadQuestion = async () => {
    setLoading(true);
    setSelected(null);
    setShowResult(false);
    const q = await generateQuizQuestion(historyRef.current);
    historyRef.current = [...historyRef.current, q.question].slice(-10);
    setQuestion(q);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  const handleAnswer = (index: number) => {
    if (showResult || !question) return;
    setSelected(index);
    setShowResult(true);
    
    if (index === question.correctAnswerIndex) {
        onWin(question.reward || 50);
    } else {
        // PENALTY
        onWin(-50);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="pt-12 pb-4 px-4 bg-slate-800/50 sticky top-0 flex items-center justify-between">
        <button onClick={onBack}><X size={24} /></button>
        <h1 className="font-bold text-xl flex items-center gap-2"><BrainCircuit className="text-purple-400"/> CyberQuiz</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center overflow-y-auto">
        {loading ? (
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <BrainCircuit size={48} className="text-purple-500 animate-spin"/>
                <p>Generating Challenge...</p>
            </div>
        ) : question ? (
            <>
                <div className="mb-8">
                    <span className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-2 block">Question</span>
                    <h2 className="text-xl font-medium leading-relaxed">{question.question}</h2>
                </div>

                <div className="space-y-3">
                    {question.options.map((opt, idx) => {
                        let bg = "bg-slate-800 border-slate-700";
                        if (showResult) {
                            if (idx === question.correctAnswerIndex) bg = "bg-green-900/40 border-green-500";
                            else if (idx === selected && idx !== question.correctAnswerIndex) bg = "bg-red-900/40 border-red-500";
                            else bg = "opacity-50 bg-slate-800 border-transparent";
                        } else if (selected === idx) {
                            bg = "bg-purple-900 border-purple-500";
                        }

                        return (
                            <button
                                key={idx}
                                disabled={showResult}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${bg} flex justify-between items-center`}
                            >
                                <span className="text-sm font-medium">{opt}</span>
                                {showResult && idx === question.correctAnswerIndex && <CheckCircle2 className="text-green-400 flex-shrink-0" size={20}/>}
                                {showResult && idx === selected && idx !== question.correctAnswerIndex && <XCircle className="text-red-400 flex-shrink-0" size={20}/>}
                            </button>
                        );
                    })}
                </div>

                {showResult && (
                    <div className="mt-8 flex flex-col items-center animate-in slide-in-from-bottom-5">
                        {selected !== question.correctAnswerIndex && (
                            <p className="text-red-400 font-bold mb-4 flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-lg">
                                <AlertTriangle size={16}/> Incorrect! You lost $50
                            </p>
                        )}
                        <button onClick={loadQuestion} className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform hover:bg-gray-100">
                            Next Question
                        </button>
                    </div>
                )}
            </>
        ) : (
            <div className="text-center">Failed to load.</div>
        )}
      </div>
    </div>
  );
};
