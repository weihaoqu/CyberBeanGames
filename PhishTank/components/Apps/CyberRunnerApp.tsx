
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Box, Key, Zap, Skull, Play, RotateCcw, Keyboard } from 'lucide-react';

interface CyberRunnerAppProps {
  onBack: () => void;
  onWin: (amount: number) => void;
}

interface Item {
    id: number;
    type: 'wall' | 'coin';
    lane: 0 | 1 | 2; // Left, Center, Right
    y: number;
}

export const CyberRunnerApp: React.FC<CyberRunnerAppProps> = ({ onBack, onWin }) => {
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'start' | 'playing' | 'gameover'>('start');
  const [playerLane, setPlayerLane] = useState<0 | 1 | 2>(1); 
  const [items, setItems] = useState<Item[]>([]);
  
  const gameState = useRef({
      items: [] as Item[],
      score: 0,
      speed: 1.5,
      lastSpawn: 0,
      spawnRate: 800,
      isPlaying: false,
      playerLane: 1 as 0 | 1 | 2
  });

  const requestRef = useRef<number | null>(null);

  const gameLoop = useCallback(() => {
      if (!gameState.current.isPlaying) return;
      const state = gameState.current;
      const now = Date.now();

      if (now - state.lastSpawn > state.spawnRate) {
          const isCoin = Math.random() > 0.6;
          const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
          
          state.items.push({
              id: now + Math.random(),
              type: isCoin ? 'coin' : 'wall',
              lane,
              y: -20
          });
          state.lastSpawn = now;
          state.speed = Math.min(3.5, state.speed + 0.001);
          state.spawnRate = Math.max(400, state.spawnRate - 1);
      }

      const surviving: Item[] = [];
      let gameOver = false;

      for (const item of state.items) {
          item.y += state.speed;

          if (item.y > 75 && item.y < 90 && item.lane === state.playerLane) {
              if (item.type === 'wall') {
                  gameOver = true;
              } else {
                  state.score += 10;
                  continue; 
              }
          }

          if (item.y > 110) {
              if (item.type === 'wall') state.score += 1;
          } else {
              surviving.push(item);
          }
      }

      state.items = surviving;

      if (gameOver) {
          state.isPlaying = false;
          setScore(state.score);
          setStatus('gameover');
          return;
      }

      setItems([...state.items]);
      setScore(state.score);

      requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const moveLeft = () => {
      setPlayerLane(l => {
          const next = Math.max(0, l - 1) as 0 | 1 | 2;
          gameState.current.playerLane = next;
          return next;
      });
  };

  const moveRight = () => {
       setPlayerLane(l => {
          const next = Math.min(2, l + 1) as 0 | 1 | 2;
          gameState.current.playerLane = next;
          return next;
      });
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!gameState.current.isPlaying) return;
          if (e.key === 'ArrowLeft') moveLeft();
          if (e.key === 'ArrowRight') moveRight();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = () => {
      gameState.current = {
          items: [],
          score: 0,
          speed: 1.2,
          lastSpawn: Date.now(),
          spawnRate: 800,
          isPlaying: true,
          playerLane: 1
      };
      setPlayerLane(1);
      setScore(0);
      setStatus('playing');
      requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
          gameState.current.isPlaying = false;
      };
  }, [gameLoop]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden font-sans select-none">
       <div className="pt-12 pb-2 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between z-10 shadow-md">
        <button onClick={onBack} disabled={status === 'playing'} className={`transition-opacity ${status === 'playing' ? 'opacity-0' : 'opacity-100'}`}>
            <X size={24} />
        </button>
        <h1 className="font-bold text-lg text-cyan-400 italic">CYBER RUNNER</h1>
        <div className="font-mono font-bold w-16 text-right text-xl text-yellow-400">${score}</div>
      </div>

      <div className="flex-1 relative bg-black overflow-hidden perspective-1000">
          <div className="absolute inset-0 opacity-30" 
              style={{ 
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 49px, #06b6d4 50px), repeating-linear-gradient(90deg, transparent, transparent 33%, #06b6d4 33.3%)',
                  backgroundSize: '100% 100px',
                  transform: 'perspective(500px) rotateX(40deg) scale(2)',
                  transformOrigin: '50% 100%'
              }}
          ></div>

          <div className="absolute inset-0 flex">
              <div className="flex-1 border-r border-cyan-900/30"></div>
              <div className="flex-1 border-r border-cyan-900/30"></div>
              <div className="flex-1"></div>
          </div>

          {status === 'playing' && (
              <div 
                className="absolute w-16 h-16 bottom-[10%] transition-all duration-100 ease-out z-20 flex items-center justify-center"
                style={{ left: `${playerLane * 33.33 + 16.66}%`, transform: 'translateX(-50%)' }}
              >
                  <Box size={48} className="text-cyan-400 fill-cyan-900 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"/>
              </div>
          )}

          {status === 'playing' && items.map(item => (
              <div 
                key={item.id}
                className="absolute transition-none flex items-center justify-center"
                style={{ 
                    left: `${item.lane * 33.33 + 16.66}%`, 
                    top: `${item.y}%`, 
                    transform: 'translate(-50%, -50%)',
                    width: '60px', height: '60px'
                }}
              >
                  {item.type === 'wall' ? (
                      <div className="w-12 h-16 bg-red-600 border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)] flex items-center justify-center rounded">
                          <Skull className="text-red-950"/>
                      </div>
                  ) : (
                      <div className="animate-spin-slow">
                          <Key size={32} className="text-yellow-400 fill-yellow-600 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"/>
                      </div>
                  )}
              </div>
          ))}

          {status === 'playing' && (
              <div className="absolute inset-0 flex z-30">
                  <div className="flex-1 active:bg-white/5" onTouchStart={(e) => { e.preventDefault(); moveLeft(); }} onClick={moveLeft}></div>
                  <div className="flex-1 active:bg-white/5" onTouchStart={(e) => { e.preventDefault(); moveRight(); }} onClick={moveRight}></div>
              </div>
          )}

          {status === 'start' && (
               <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-6 text-center">
                  <Zap size={64} className="text-cyan-400 mb-4 animate-pulse"/>
                  <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">RUN OR CRASH</h1>
                  <button onClick={startGame} className="bg-cyan-600 text-black px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform flex items-center gap-2">
                      <Play size={24} fill="black"/> RUN
                  </button>
              </div>
          )}

          {status === 'gameover' && (
               <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center z-50 p-6 text-center">
                  <Skull size={64} className="text-red-500 mb-4"/>
                  <h1 className="text-3xl font-black text-white mb-2">CRASHED</h1>
                  <p className="text-4xl font-mono text-yellow-400 font-bold mb-8">${score}</p>
                  <div className="w-full max-w-xs space-y-3">
                    <button onClick={() => onWin(score)} className="w-full bg-green-600 py-3 rounded-xl font-bold text-white shadow-lg">CASH OUT</button>
                    <button onClick={startGame} className="w-full bg-white/10 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"><RotateCcw size={16}/> RETRY</button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
