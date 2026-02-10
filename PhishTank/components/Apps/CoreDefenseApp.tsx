
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Hexagon, CircleDot, Bomb, Target, RotateCcw, Play } from 'lucide-react';

interface CoreDefenseAppProps {
  onBack: () => void;
  onWin: (amount: number) => void;
}

interface Enemy {
    id: number;
    angle: number; 
    dist: number; 
    speed: number;
    type: 'basic' | 'fast' | 'tank';
    hp: number;
}

export const CoreDefenseApp: React.FC<CoreDefenseAppProps> = ({ onBack, onWin }) => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [status, setStatus] = useState<'start' | 'playing' | 'gameover'>('start');
  const [renderEnemies, setRenderEnemies] = useState<Enemy[]>([]);

  const gameState = useRef({
      enemies: [] as Enemy[],
      score: 0,
      health: 100,
      spawnRate: 1500,
      lastSpawn: 0,
      difficulty: 1,
      isPlaying: false
  });

  const requestRef = useRef<number | null>(null);

  const gameLoop = useCallback(() => {
      if (!gameState.current.isPlaying) return;
      const state = gameState.current;
      const now = Date.now();

      if (now - state.lastSpawn > state.spawnRate) {
          const typeRoll = Math.random();
          let type: 'basic' | 'fast' | 'tank' = 'basic';
          let speed = 0.2;
          let hp = 1;

          if (typeRoll > 0.8) {
              type = 'fast';
              speed = 0.4;
          } else if (typeRoll > 0.9) {
              type = 'tank';
              speed = 0.1;
              hp = 3;
          }

          state.enemies.push({
              id: now + Math.random(),
              angle: Math.random() * Math.PI * 2,
              dist: 100,
              speed: speed * state.difficulty,
              type,
              hp
          });
          state.lastSpawn = now;
          state.spawnRate = Math.max(500, state.spawnRate - 10);
          state.difficulty += 0.05;
      }

      const surviving: Enemy[] = [];
      let damage = 0;

      for (const e of state.enemies) {
          e.dist -= e.speed;
          if (e.dist <= 10) { 
              damage += 10;
          } else {
              surviving.push(e);
          }
      }

      state.enemies = surviving;
      state.health = Math.max(0, state.health - damage);

      if (state.health <= 0) {
          state.isPlaying = false;
          setScore(state.score);
          setHealth(0);
          setStatus('gameover');
          return;
      }

      setRenderEnemies([...state.enemies]);
      setHealth(state.health);

      requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const startGame = () => {
      gameState.current = {
          enemies: [],
          score: 0,
          health: 100,
          spawnRate: 1500,
          lastSpawn: Date.now(),
          difficulty: 1,
          isPlaying: true
      };
      setScore(0);
      setHealth(100);
      setStatus('playing');
      requestRef.current = requestAnimationFrame(gameLoop);
  };

  const handleTapEnemy = (id: number) => {
      if (status !== 'playing') return;
      const state = gameState.current;
      const idx = state.enemies.findIndex(e => e.id === id);
      
      if (idx !== -1) {
          state.enemies[idx].hp--;
          if (state.enemies[idx].hp <= 0) {
              state.enemies.splice(idx, 1);
              state.score += 25;
              setScore(state.score);
          }
      }
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
        <div className="flex flex-col items-center flex-1 px-4">
             <div className="text-[10px] uppercase font-bold text-slate-400">Core Health</div>
             <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-500 transition-all" style={{ width: `${health}%`}}></div>
             </div>
        </div>
        <div className="font-mono font-bold w-16 text-right text-xl text-yellow-400">${score}</div>
      </div>

      <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 border border-slate-800 rounded-full scale-[1.5] opacity-20 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-0 border border-slate-800 rounded-full scale-[0.8] opacity-20"></div>

          <div className="relative z-10 w-20 h-20 bg-purple-900/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] border-4 border-purple-500">
               <Hexagon size={40} className="text-purple-200 fill-purple-900 animate-pulse"/>
          </div>

          {status === 'playing' && renderEnemies.map(e => {
              const x = Math.cos(e.angle) * e.dist * 1.8;
              const y = Math.sin(e.angle) * e.dist * 1.8;
              
              return (
                  <div
                    key={e.id}
                    onMouseDown={() => handleTapEnemy(e.id)}
                    onTouchStart={(ev) => { ev.preventDefault(); handleTapEnemy(e.id); }}
                    className={`absolute w-12 h-12 flex items-center justify-center cursor-pointer transition-transform duration-100 active:scale-90
                        ${e.type === 'tank' ? 'scale-125' : ''}
                    `}
                    style={{ 
                        transform: `translate(${x}px, ${y}px)`,
                        zIndex: 20
                    }}
                  >
                      {e.type === 'basic' && <CircleDot size={32} className="text-red-500 fill-red-900 drop-shadow-lg"/>}
                      {e.type === 'fast' && <Target size={28} className="text-yellow-400 fill-yellow-900 drop-shadow-lg animate-spin"/>}
                      {e.type === 'tank' && <Bomb size={36} className="text-orange-500 fill-orange-900 drop-shadow-lg"/>}
                  </div>
              )
          })}

          {status === 'start' && (
               <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-6 text-center">
                   <Target size={64} className="text-purple-500 mb-4"/>
                   <h1 className="text-4xl font-black text-white mb-2">CORE DEFENSE</h1>
                   <button onClick={startGame} className="bg-purple-600 px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform flex items-center gap-2">
                       <Play size={24} fill="currentColor"/> DEFEND
                   </button>
               </div>
          )}

          {status === 'gameover' && (
               <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center z-50 p-6 text-center">
                   <Bomb size={64} className="text-red-500 mb-4"/>
                   <h1 className="text-3xl font-black text-white mb-2">CORE DESTROYED</h1>
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
