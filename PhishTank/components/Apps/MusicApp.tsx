
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Disc, Volume2, Music4 } from 'lucide-react';

interface MusicAppProps {
  onBack: () => void;
}

const SONGS = [
    { title: "Cyber City", artist: "Synthwave Boy", color: "from-purple-500 to-pink-500", tempo: 110, scale: [261.63, 311.13, 392.00, 466.16] }, // Cm
    { title: "Mainframe Breach", artist: "Glitch Mob", color: "from-green-500 to-emerald-700", tempo: 120, scale: [220.00, 261.63, 329.63, 415.30] }, // Am
    { title: "Midnight Hack", artist: "LoFi Coder", color: "from-blue-600 to-indigo-800", tempo: 90, scale: [196.00, 246.94, 293.66, 349.23] }, // G
    { title: "Firewall Protocol", artist: "System 32", color: "from-red-500 to-orange-600", tempo: 140, scale: [174.61, 220.00, 261.63, 349.23] }, // F
    { title: "Tokyo Drift", artist: "Neon Nights", color: "from-fuchsia-600 to-purple-800", tempo: 128, scale: [261.63, 277.18, 311.13, 392.00, 415.30] }, // Hirajoshi (Japanese)
    { title: "Hacker Blues", artist: "The Encryptors", color: "from-slate-700 to-slate-900", tempo: 85, scale: [196.00, 233.08, 261.63, 277.18, 293.66, 349.23] }, // Blues Scale
    { title: "Deep Web Chill", artist: "Anonymous", color: "from-cyan-600 to-blue-900", tempo: 100, scale: [261.63, 293.66, 329.63, 392.00, 440.00] }, // Major Pentatonic
    { title: "Zero Day", artist: "Exploit Kit", color: "from-rose-700 to-red-900", tempo: 150, scale: [110.00, 116.54, 146.83, 155.56] } // Phrygian Dark
];

export const MusicApp: React.FC<MusicAppProps> = ({ onBack }) => {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const noteIndexRef = useRef<number>(0);

  const currentSong = SONGS[trackIdx];

  // --- AUDIO ENGINE ---
  useEffect(() => {
    if (playing) {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        nextNoteTimeRef.current = audioCtxRef.current.currentTime;
        scheduler();
    } else {
        if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
    }
    return () => {
        if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
        if (audioCtxRef.current) audioCtxRef.current.close();
        audioCtxRef.current = null;
    };
  }, [playing, trackIdx]);

  const scheduler = () => {
      if (!audioCtxRef.current) return;
      while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
          playNote(nextNoteTimeRef.current);
          scheduleNextNote();
      }
      timerIDRef.current = window.setTimeout(scheduler, 25);
  };

  const scheduleNextNote = () => {
      const secondsPerBeat = 60.0 / currentSong.tempo;
      nextNoteTimeRef.current += 0.25 * secondsPerBeat; // 16th notes
      noteIndexRef.current++;
      if (noteIndexRef.current >= 16) noteIndexRef.current = 0;
  };

  const playNote = (time: number) => {
      if (!audioCtxRef.current) return;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      // Procedural Melody Logic
      const scale = currentSong.scale;
      
      // Bass line on beat 1 and 9
      if (noteIndexRef.current === 0 || noteIndexRef.current === 8) {
          osc.frequency.value = scale[0] / 2;
          gain.gain.setValueAtTime(0.3, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
          osc.type = 'sawtooth';
          osc.start(time);
          osc.stop(time + 0.5);
      } 
      // Arpeggio / Melody on other beats
      else if (Math.random() > 0.4) {
          const note = scale[Math.floor(Math.random() * scale.length)];
          osc.frequency.value = note * (Math.random() > 0.8 ? 2 : 1);
          osc.type = Math.random() > 0.5 ? 'triangle' : 'square';
          
          const volume = Math.random() * 0.1;
          gain.gain.setValueAtTime(volume, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
          osc.start(time);
          osc.stop(time + 0.1);
      }
  };

  // --- PROGRESS UI ---
  useEffect(() => {
      let interval: any;
      if (playing) {
          interval = setInterval(() => {
              setProgress(p => {
                  if (p >= 100) {
                      setTrackIdx(t => (t + 1) % SONGS.length);
                      return 0;
                  }
                  return p + 0.2;
              });
          }, 100);
      }
      return () => clearInterval(interval);
  }, [playing]);

  const handleNext = () => {
      setTrackIdx((trackIdx + 1) % SONGS.length);
      setProgress(0);
      setPlaying(true);
  };
  
  const handlePrev = () => {
      setTrackIdx((trackIdx - 1 + SONGS.length) % SONGS.length);
      setProgress(0);
      setPlaying(true);
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br ${currentSong.color} text-white transition-colors duration-1000`}>
      <div className="pt-12 pb-4 px-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="bg-white/10 p-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"><X size={24} /></button>
        <h1 className="font-bold text-xs uppercase tracking-[0.2em] opacity-80 flex items-center gap-2"><Music4 size={14}/> ByteBeats</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
          
          {/* Album Art / Visualizer */}
          <div className="w-64 h-64 bg-black/20 rounded-3xl shadow-2xl backdrop-blur-sm flex items-center justify-center mb-10 relative overflow-hidden group border border-white/10">
              <div className={`absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10`}></div>
              <Disc size={120} className={`text-white/80 z-20 transition-all duration-1000 ${playing ? 'animate-[spin_4s_linear_infinite] opacity-100' : 'opacity-50'}`} />
              
              {/* Bars Visualizer */}
              {playing && (
                  <div className="absolute bottom-0 inset-x-0 h-32 flex items-end justify-center gap-1.5 p-6 z-20 opacity-60">
                      {[...Array(16)].map((_,i) => (
                          <div key={i} className="w-2.5 bg-white rounded-t-sm animate-pulse" style={{ height: `${10 + Math.random() * 90}%`, animationDuration: `${0.2 + Math.random() * 0.5}s` }}></div>
                      ))}
                  </div>
              )}
          </div>

          <div className="w-full mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2 truncate">{currentSong.title}</h2>
              <p className="text-white/60 font-medium text-lg tracking-wide">{currentSong.artist}</p>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden cursor-pointer">
              <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-100" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between w-full text-xs font-medium text-white/50 mb-10 font-mono">
              <span>0:{(progress * 2.4).toFixed(0).padStart(2, '0')}</span>
              <span>3:45</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full max-w-[280px]">
              <button onClick={handlePrev} className="text-white/80 hover:text-white transition-colors active:scale-95"><SkipBack size={36} fill="currentColor"/></button>
              
              <button 
                onClick={() => setPlaying(!playing)}
                className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                  {playing ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor" className="ml-1"/>}
              </button>
              
              <button onClick={handleNext} className="text-white/80 hover:text-white transition-colors active:scale-95"><SkipForward size={36} fill="currentColor"/></button>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-white/40 text-xs">
              <Volume2 size={14} /> Web Audio API Active
          </div>

      </div>
    </div>
  );
};
