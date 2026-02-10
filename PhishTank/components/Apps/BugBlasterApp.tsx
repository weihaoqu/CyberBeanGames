
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Crosshair, Zap, Bug, Skull, Play, RotateCcw } from 'lucide-react';

interface BugBlasterAppProps {
  onBack: () => void;
  onWin: (amount: number) => void;
}

interface Entity {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'player' | 'bullet' | 'bug' | 'bomb';
}

export const BugBlasterApp: React.FC<BugBlasterAppProps> = ({ onBack, onWin }) => {
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'start' | 'playing' | 'gameover'>('start');
  const [entities, setEntities] = useState<Entity[]>([]);
  
  const gameState = useRef({
      playerX: 50,
      bullets: [] as Entity[],
      enemies: [] as Entity[],
      score: 0,
      lastShot: 0,
      lastSpawn: 0,
      spawnRate: 1000,
      isPlaying: false,
      inputs: { left: false, right: false, shoot: false }
  });

  const requestRef = useRef<number | null>(null);

  const gameLoop = useCallback(() => {
      if (!gameState.current.isPlaying) return;
      const state = gameState.current;
      const now = Date.now();

      // 1. Handle Smooth Movement
      if (state.inputs.left) state.playerX = Math.max(5, state.playerX - 1.5);
      if (state.inputs.right) state.playerX = Math.min(95, state.playerX + 1.5);
      
      // Auto-fire if held (optional) or just manual
      // if (state.inputs.shoot) shoot();

      // 2. Spawning
      if (now - state.lastSpawn > state.spawnRate) {
          state.enemies.push({
              id: now,
              x: Math.random() * 90 + 5,
              y: 0,
              width: 10,
              height: 6,
              type: 'bug'
          });
          state.lastSpawn = now;
          state.spawnRate = Math.max(300, state.spawnRate - 5);
      }

      // 3. Bullets
      const nextBullets: Entity[] = [];
      for (const b of state.bullets) {
          b.y -= 2;
          if (b.y > 0) nextBullets.push(b);
      }
      state.bullets = nextBullets;

      // 4. Enemies & Collisions
      const nextEnemies: Entity[] = [];
      let gameOver = false;

      for (const e of state.enemies) {
          e.y += 0.4; // Slightly faster fall
          
          if (e.y > 85 && e.y < 95 && Math.abs(e.x - state.playerX) < 10) {
              gameOver = true;
          }

          let hit = false;
          for (let i = 0; i < state.bullets.length; i++) {
              const b = state.bullets[i];
              if (Math.abs(b.x - e.x) < 5 && Math.abs(b.y - e.y) < 5) {
                  hit = true;
                  state.score += 10;
                  state.bullets.splice(i, 1);
                  break;
              }
          }

          if (!hit && e.y < 100) nextEnemies.push(e);
          if (!hit && e.y >= 100) gameOver = true;
      }
      state.enemies = nextEnemies;

      if (gameOver) {
          state.isPlaying = false;
          setScore(state.score);
          setStatus('gameover');
          return;
      }

      setScore(state.score);
      setEntities([...state.bullets, ...state.enemies]);
      
      requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const shoot = () => {
      const now = Date.now();
      if (now - gameState.current.lastShot > 250) {
          gameState.current.bullets.push({
              id: now,
              x: gameState.current.playerX,
              y: 85,
              width: 2,
              height: 4,
              type: 'bullet'
          });
          gameState.current.lastShot = now;
      }
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!gameState.current.isPlaying) return;
          if (e.key === 'ArrowLeft') gameState.current.inputs.left = true;
          if (e.key === 'ArrowRight') gameState.current.inputs.right = true;
          if (e.key === ' ') shoot();
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft') gameState.current.inputs.left = false;
          if (e.key === 'ArrowRight') gameState.current.inputs.right = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, []);

  // Touch Handlers for Smooth Mobile Movement
  const handleTouchStart = (dir: 'left' | 'right') => {
      if (dir === 'left') gameState.current.inputs.left = true;
      else gameState.current.inputs.right = true;
  };
  const handleTouchEnd = () => {
      gameState.current.inputs.left = false;
      gameState.current.inputs.right = false;
  };

  const startGame = () => {
      gameState.current = {
          playerX: 50,
          bullets: [],
          enemies: [],
          score: 0,
          lastShot: 0,
          lastSpawn: Date.now(),
          spawnRate: 1000,
          isPlaying: true,
          inputs: { left: false, right: false, shoot: false }
      };
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
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden select-none">
       <div className="pt-12 pb-2 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between z-10 shadow-md">
        <button onClick={onBack} disabled={status === 'playing'} className={`transition-opacity ${status === 'playing' ? 'opacity-0' : 'opacity-100'}`}>
            <X size={24} />
        </button>
        <h1 className="font-bold text-lg text-green-400 italic">BUG BLASTER</h1>
        <div className="font-mono font-bold w-16 text-right text-xl text-yellow-400">{score}</div>
      </div>

      <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>

          {status === 'playing' && (
              <div 
                className="absolute w-10 h-10 bottom-[5%] transition-none z-20 flex items-center justify-center will-change-transform"
                style={{ left: `${gameState.current.playerX}%`, transform: 'translateX(-50%)' }}
              >
                  <Crosshair size={40} className="text-green-400"/>
              </div>
          )}

          {status === 'playing' && entities.map(e => (
              <div 
                key={e.id}
                className="absolute flex items-center justify-center will-change-transform"
                style={{ 
                    left: `${e.x}%`, 
                    top: `${e.y}%`, 
                    width: `${e.width}%`,
                    height: `${e.height}%`,
                    transform: 'translate(-50%, -50%)'
                }}
              >
                  {e.type === 'bug' && <Bug size={24} className="text-red-500 fill-red-900 animate-bounce"/>}
                  {e.type === 'bullet' && <div className="w-1 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_yellow]"></div>}
              </div>
          ))}

          {status === 'playing' && (
              <div className="absolute inset-0 z-30 flex flex-col justify-end">
                  <div className="h-1/3 w-full flex" onTouchStart={(e) => { e.preventDefault(); shoot(); }} onClick={shoot}></div>
                  <div className="h-1/3 w-full flex">
                      <div 
                        className="flex-1 active:bg-white/10" 
                        onTouchStart={(e) => { e.preventDefault(); handleTouchStart('left'); }} 
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={() => handleTouchStart('left')}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                      ></div>
                      <div 
                        className="flex-1 active:bg-white/10" 
                        onTouchStart={(e) => { e.preventDefault(); handleTouchStart('right'); }} 
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={() => handleTouchStart('right')}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                      ></div>
                  </div>
              </div>
          )}

          {status === 'start' && (
               <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-6 text-center">
                   <Zap size={64} className="text-green-500 mb-4 animate-pulse"/>
                   <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">BUG BLASTER</h1>
                   <button onClick={startGame} className="bg-green-600 text-black px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform flex items-center gap-2">
                       <Play size={24} fill="black"/> START GAME
                   </button>
               </div>
          )}

          {status === 'gameover' && (
               <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center z-50 p-6 text-center">
                  <Skull size={64} className="text-red-500 mb-4"/>
                  <h1 className="text-3xl font-black text-white mb-2">GAME OVER</h1>
                  <p className="text-4xl font-mono text-yellow-400 font-bold mb-8">{score}</p>
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
