
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Shield, Bug, FileCheck, Play, RotateCcw, AlertOctagon, Skull } from 'lucide-react';

interface FirewallAppProps {
  onBack: () => void;
  onWin: (amount: number) => void;
}

interface Packet {
    id: number;
    type: 'malware' | 'data' | 'boss';
    x: number;
    y: number;
    speed: number;
    hp: number; // For boss
    maxHp: number;
}

export const FirewallApp: React.FC<FirewallAppProps> = ({ onBack, onWin }) => {
  // UI State
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  const [gameStatus, setGameStatus] = useState<'start' | 'playing' | 'gameover'>('start');
  const [renderPackets, setRenderPackets] = useState<Packet[]>([]);
  
  // Game Logic State
  const gameState = useRef({
      packets: [] as Packet[],
      score: 0,
      health: 100,
      level: 1,
      lastSpawn: 0,
      spawnRate: 1000,
      isPlaying: false,
      difficultyMultiplier: 1
  });

  const requestRef = useRef<number | null>(null);
  const loopRef = useRef<() => void>(null);

  const gameLoop = useCallback(() => {
      if (!gameState.current.isPlaying) return;
      
      const now = Date.now();
      const state = gameState.current;

      // 1. Spawning Logic
      if (now - state.lastSpawn > state.spawnRate) {
          const rand = Math.random();
          let type: 'malware' | 'data' | 'boss' = 'data';
          let speed = (Math.random() * 0.3 + 0.3) * state.difficultyMultiplier;
          let hp = 1;

          if (rand > 0.95 && state.level > 2) {
              type = 'boss'; // Boss spawns rarely after lvl 2
              speed = 0.1 * state.difficultyMultiplier; // Slow but tanky
              hp = 5;
          } else if (rand > 0.4) {
              type = 'malware';
          }

          const newPacket: Packet = {
              id: now + Math.random(),
              type,
              x: Math.random() * 70 + 10,
              y: -15,
              speed,
              hp,
              maxHp: hp
          };
          state.packets.push(newPacket);
          state.lastSpawn = now;
      }

      // 2. Level Up Logic
      const nextLevelScore = state.level * 200;
      if (state.score >= nextLevelScore) {
          state.level++;
          state.difficultyMultiplier += 0.2;
          state.spawnRate = Math.max(300, state.spawnRate - 100);
      }

      // 3. Update Positions & Collisions
      const survivingPackets: Packet[] = [];
      let healthLost = 0;
      let pointsGained = 0;

      for (const p of state.packets) {
          p.y += p.speed;

          if (p.y > 100) {
              // Reached Bottom
              if (p.type === 'malware') {
                  healthLost += 15;
              } else if (p.type === 'boss') {
                  healthLost += 50; // Boss hurts a lot
              } else {
                  pointsGained += 5; // Passive gain for letting data through
              }
          } else {
              survivingPackets.push(p);
          }
      }

      state.packets = survivingPackets;

      // 4. Update Stats
      if (healthLost > 0) state.health = Math.max(0, state.health - healthLost);
      if (pointsGained > 0) state.score += pointsGained;

      // 5. Check Game Over
      if (state.health <= 0) {
          state.isPlaying = false;
          setGameStatus('gameover');
          setHealth(0);
          setScore(state.score);
          return;
      }

      // 6. Sync to UI
      setRenderPackets([...state.packets]); 
      setHealth(state.health);
      setScore(state.score);
      setLevel(state.level);

      if (loopRef.current) {
        requestRef.current = requestAnimationFrame(loopRef.current);
      }
  }, []);

  useEffect(() => {
      loopRef.current = gameLoop;
  }, [gameLoop]);

  const startGame = () => {
      gameState.current = {
          packets: [],
          score: 0,
          health: 100,
          level: 1,
          lastSpawn: Date.now(),
          spawnRate: 1200,
          isPlaying: true,
          difficultyMultiplier: 1
      };
      setScore(0);
      setHealth(100);
      setLevel(1);
      setGameStatus('playing');
      if (loopRef.current) requestRef.current = requestAnimationFrame(loopRef.current);
  };

  const handleInteract = (id: number, type: 'malware' | 'data' | 'boss') => {
      if (gameStatus !== 'playing') return;

      const state = gameState.current;
      const packet = state.packets.find(p => p.id === id);
      
      if (packet) {
          if (type === 'data') {
              // Bad hit
              state.health = Math.max(0, state.health - 10);
              state.score = Math.max(0, state.score - 50);
              state.packets = state.packets.filter(p => p.id !== id);
          } else {
              // Good hit (Malware/Boss)
              packet.hp--;
              if (packet.hp <= 0) {
                  state.score += type === 'boss' ? 100 : 25;
                  state.packets = state.packets.filter(p => p.id !== id);
              } else {
                  // Hit effect or feedback could go here
              }
          }
          
          setRenderPackets([...state.packets]);
          setScore(state.score);
          setHealth(state.health);
      }
  };

  useEffect(() => {
      return () => {
          if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
          gameState.current.isPlaying = false;
      };
  }, []);

  const handleCashOut = () => {
      onWin(gameState.current.score); 
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden relative select-none font-sans">
      
      {/* Header */}
      <div className="pt-12 pb-2 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between z-10 shadow-md">
        <button onClick={onBack} disabled={gameStatus === 'playing'} className={`transition-opacity ${gameStatus === 'playing' ? 'opacity-0' : 'opacity-100'}`}>
            <X size={24} />
        </button>
        <div className="flex flex-col items-center flex-1 px-4">
            <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-yellow-400 font-bold">LVL {level}</span>
                 <span className="text-[10px] uppercase text-slate-400 font-bold">Integrity</span>
            </div>
            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden relative border border-slate-600">
                <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${health > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-500'}`} 
                    style={{ width: `${health}%`}}
                ></div>
            </div>
        </div>
        <div className="font-mono font-bold w-16 text-right text-xl text-yellow-400 drop-shadow-sm">{score}</div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden isolate touch-none">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Level Indicator Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-slate-800 pointer-events-none opacity-20">
              {level}
          </div>

          {/* Packets */}
          {gameStatus === 'playing' && renderPackets.map(p => (
              <div
                key={p.id}
                onMouseDown={() => handleInteract(p.id, p.type)}
                onTouchStart={(e) => { e.preventDefault(); handleInteract(p.id, p.type); }}
                className={`absolute rounded-xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform cursor-pointer will-change-transform 
                ${p.type === 'malware' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] z-20 w-16 h-16' : ''} 
                ${p.type === 'data' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] z-10 w-14 h-14' : ''}
                ${p.type === 'boss' ? 'bg-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.8)] z-30 w-24 h-24 border-4 border-purple-400' : ''}
                `}
                style={{ 
                    left: `${p.x}%`, 
                    top: `${p.y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
              >
                  {p.type === 'malware' && <Bug size={32} className="text-white fill-red-900 animate-pulse"/>}
                  {p.type === 'data' && <FileCheck size={28} className="text-white fill-blue-900"/>}
                  {p.type === 'boss' && (
                      <div className="relative flex items-center justify-center">
                          <Skull size={48} className="text-white"/>
                          <div className="absolute -bottom-8 w-full h-1 bg-black/50 rounded-full">
                              <div className="h-full bg-purple-300 transition-all" style={{ width: `${(p.hp / p.maxHp) * 100}%`}}></div>
                          </div>
                      </div>
                  )}
              </div>
          ))}

          {/* Start Screen */}
          {gameStatus === 'start' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 text-center animate-in fade-in">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-blue-500/50">
                      <Shield size={48} className="text-blue-400"/>
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2 tracking-tight">FIREWALL 2.0</h1>
                  <p className="text-blue-200 mb-8 max-w-xs text-sm">
                      Protect the core.<br/>
                      <span className="text-red-400 font-bold">DESTROY RED MALWARE</span><br/>
                      <span className="text-purple-400 font-bold">BOSSES TAKE MULTIPLE HITS</span><br/>
                      <span className="text-blue-400 font-bold">SAVE BLUE DATA</span>
                  </p>
                  <button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-95 transition-all flex items-center gap-2">
                      <Play size={24} fill="currentColor"/> START
                  </button>
              </div>
          )}

          {/* Game Over Screen */}
          {gameStatus === 'gameover' && (
              <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-center animate-in zoom-in-95">
                  <AlertOctagon size={80} className="text-red-500 mb-4 drop-shadow-lg"/>
                  <h2 className="text-4xl font-black text-white mb-2">BREACHED</h2>
                  <p className="text-red-200 mb-1">System Overrun at Level {level}</p>
                  
                  <div className="bg-black/40 rounded-xl p-6 w-full max-w-xs mb-8 border border-red-500/30">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Final Score</p>
                      <p className="text-4xl font-mono font-bold text-yellow-400">${score}</p>
                  </div>

                  <div className="flex flex-col gap-3 w-full max-w-xs">
                      <button onClick={handleCashOut} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all w-full">
                          CASH OUT ${score}
                      </button>
                      <button onClick={startGame} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all w-full flex items-center justify-center gap-2">
                          <RotateCcw size={16}/> RETRY (Lose Cash)
                      </button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
