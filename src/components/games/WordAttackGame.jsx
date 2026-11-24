import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import { Shield, Trophy, Play, RotateCcw, Crosshair, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const ATTACK_WORDS = [
  'void', 'beam', 'warp', 'core', 'nova', 'ship', 'star', 'fire', 'bolt', 'flux',
  'pulse', 'alien', 'space', 'laser', 'shield', 'plasma', 'rocket', 'galaxy',
  'comet', 'orbit', 'cyber', 'matrix', 'vector', 'blaster', 'nebula', 'gravity'
];

export default function WordAttackGame({ onBack }) {
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [wave, setWave] = useState(1);
  const [currentInput, setCurrentInput] = useState('');
  const [enemies, setEnemies] = useState([]);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tm_attack_high') || '0', 10);
  });

  const animFrameRef = useRef(null);
  const inputRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const nextIdRef = useRef(1);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setShield(100);
    setWave(1);
    setCurrentInput('');
    setEnemies([]);
    lastSpawnRef.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    let isMounted = true;

    const loop = () => {
      const now = Date.now();
      const spawnInterval = Math.max(1000, 2800 - wave * 250);

      // Spawn enemy
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const word = ATTACK_WORDS[Math.floor(Math.random() * ATTACK_WORDS.length)];
        const newEnemy = {
          id: nextIdRef.current++,
          word,
          x: Math.floor(10 + Math.random() * 80),
          y: 0,
          speed: 0.22 + (wave * 0.05)
        };
        setEnemies(prev => [...prev, newEnemy]);
      }

      // Move enemies down
      setEnemies(prev => {
        const next = [];
        let hitDamage = 0;

        for (const e of prev) {
          const nextY = e.y + e.speed;
          if (nextY >= 88) {
            // Hit shield!
            hitDamage += 25;
            soundManager.playError();
          } else {
            next.push({ ...e, y: nextY });
          }
        }

        if (hitDamage > 0) {
          setShield(s => {
            const updated = s - hitDamage;
            if (updated <= 0) {
              endGame();
            }
            return Math.max(0, updated);
          });
        }

        return next;
      });

      if (isMounted && gameState === 'playing') {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, wave]);

  const endGame = () => {
    setGameState('gameover');
    soundManager.playError();
    setScore(currentScore => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('tm_attack_high', currentScore.toString());
        confetti({ particleCount: 70, spread: 60 });
      }
      return currentScore;
    });
  };

  const handleKeyDown = (e) => {
    if (gameState !== 'playing') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      setCurrentInput(prev => prev.slice(0, -1));
      return;
    }

    if (e.key.length === 1) {
      const nextInput = (currentInput + e.key).toLowerCase().trim();
      setCurrentInput(nextInput);

      const matchedIdx = enemies.findIndex(en => en.word.toLowerCase() === nextInput);

      if (matchedIdx !== -1) {
        soundManager.playLaser();
        const matched = enemies[matchedIdx];
        setEnemies(prev => prev.filter(en => en.id !== matched.id));
        setCurrentInput('');

        setScore(prev => {
          const added = 120 + matched.word.length * 25;
          const newScore = prev + added;
          if (Math.floor(newScore / 700) > Math.floor(prev / 700)) {
            setWave(w => w + 1);
            soundManager.playSuccess();
          }
          return newScore;
        });
      }
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto py-6 px-4 select-none"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -z-10"
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/90 rounded-2xl border border-slate-800 p-4 mb-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Word Attack: Defender</h2>
            <p className="text-xs text-slate-400">Neutralize descending drones before they penetrate your shield!</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Wave</div>
            <div className="text-lg font-mono font-bold text-purple-400">{wave}</div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
            <div className="text-lg font-mono font-bold text-white">{score}</div>
          </div>

          {/* Shield Health */}
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${shield > 40 ? 'text-cyan-400' : 'text-rose-500 animate-pulse'}`} />
            <div className="w-24 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div 
                className={`h-full transition-all duration-200 ${
                  shield > 50 ? 'bg-cyan-400' : shield > 25 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${shield}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="relative h-[480px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl">
        {/* Starfield grid effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        {/* Shield line at base */}
        <div className="absolute bottom-12 left-0 right-0 h-1 bg-cyan-500/60 shadow-[0_0_15px_#06b6d4]" />
        
        {/* Enemies */}
        {enemies.map(en => {
          const isMatched = currentInput.length > 0 && en.word.toLowerCase().startsWith(currentInput);

          return (
            <div
              key={en.id}
              className={`absolute transform -translate-x-1/2 flex items-center justify-center px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                isMatched 
                  ? 'bg-rose-600 text-white border-rose-300 shadow-lg shadow-rose-500/50 scale-110 ring-2 ring-rose-400' 
                  : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 shadow-md shadow-cyan-950'
              }`}
              style={{
                left: `${en.x}%`,
                top: `${en.y}%`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-ping" />
              <span>{en.word}</span>
            </div>
          );
        })}

        {/* Typing Bar */}
        {gameState === 'playing' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/50 shadow-xl flex items-center gap-2">
            <span className="text-xs uppercase text-slate-400 font-semibold">Laser Target:</span>
            <span className="font-mono text-lg font-black text-cyan-400 tracking-wider">
              {currentInput || '...'}
            </span>
          </div>
        )}

        {/* Menu Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mb-4 shadow-xl">
              <Crosshair className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-2">Word Attack</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Defend the perimeter against alien invaders. Type words to fire laser cannons and protect your energy shield.
            </p>
            {highScore > 0 && (
              <div className="mb-6 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Record: {highScore} pts</span>
              </div>
            )}
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Deploy Defense</span>
            </button>
          </div>
        )}

        {/* Game Over */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-3xl font-black text-rose-400 tracking-tight mb-1">Shield Breached</h3>
            <p className="text-sm text-slate-400 mb-6">Excellent defense! You repelled many waves.</p>

            <div className="grid grid-cols-2 gap-4 max-w-xs w-full mb-6">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                <div className="text-2xl font-mono font-black text-white">{score}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Wave Reached</div>
                <div className="text-2xl font-mono font-black text-cyan-400">{wave}</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Defense</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
