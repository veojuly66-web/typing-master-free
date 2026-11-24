import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import { Heart, Trophy, Play, RotateCcw, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORD_BANK = [
  'cat', 'dog', 'sun', 'sky', 'sea', 'run', 'fly', 'glow', 'fire', 'star',
  'blue', 'gold', 'wave', 'tree', 'wind', 'fast', 'jump', 'code', 'type', 'flow',
  'speed', 'spark', 'laser', 'cloud', 'light', 'water', 'dream', 'space', 'magic', 'swift',
  'energy', 'master', 'rocket', 'galaxy', 'planet', 'crystal', 'quantum', 'velocity'
];

export default function WordBubblesGame({ onBack }) {
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [currentInput, setCurrentInput] = useState('');
  const [bubbles, setBubbles] = useState([]);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tm_bubbles_high') || '0', 10);
  });

  const animFrameRef = useRef(null);
  const inputRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const nextIdRef = useRef(1);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setCurrentInput('');
    setBubbles([]);
    lastSpawnRef.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let isMounted = true;

    const loop = () => {
      const now = Date.now();
      const spawnInterval = Math.max(1200, 2600 - level * 200);

      // Spawn new bubble
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const word = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
        const newBubble = {
          id: nextIdRef.current++,
          word,
          x: Math.floor(10 + Math.random() * 80), // 10% to 90% horizontal
          y: 0, // starts at top (0%) and floats down to 90%
          speed: 0.18 + (level * 0.04) + (Math.random() * 0.08),
          color: ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-purple-500 to-pink-600', 'from-amber-500 to-orange-600'][Math.floor(Math.random() * 4)]
        };
        setBubbles(prev => [...prev, newBubble]);
      }

      // Move bubbles down
      setBubbles(prev => {
        const next = [];
        let lostLife = false;

        for (const b of prev) {
          const nextY = b.y + b.speed;
          if (nextY >= 90) {
            // Hit bottom boundary
            lostLife = true;
            soundManager.playError();
          } else {
            next.push({ ...b, y: nextY });
          }
        }

        if (lostLife) {
          setLives(l => {
            const updated = l - 1;
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
  }, [gameState, level]);

  const endGame = () => {
    setGameState('gameover');
    soundManager.playError();
    setScore(currentScore => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('tm_bubbles_high', currentScore.toString());
        confetti({ particleCount: 70, spread: 60 });
      }
      return currentScore;
    });
  };

  // Handle typing inside game
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

      // Check if matches any active bubble!
      const matchedIdx = bubbles.findIndex(b => b.word.toLowerCase() === nextInput);

      if (matchedIdx !== -1) {
        // POP!
        soundManager.playBubblePop();
        const matched = bubbles[matchedIdx];
        setBubbles(prev => prev.filter(b => b.id !== matched.id));
        setCurrentInput('');

        setScore(prev => {
          const added = 100 + matched.word.length * 20;
          const newScore = prev + added;
          // Level up every 600 points
          if (Math.floor(newScore / 600) > Math.floor(prev / 600)) {
            setLevel(lvl => lvl + 1);
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

      {/* Game Header */}
      <div className="flex items-center justify-between bg-slate-900/90 rounded-2xl border border-slate-800 p-4 mb-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Word Bubbles</h2>
            <p className="text-xs text-slate-400">Type words to pop bubbles before they touch the ground!</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Level</div>
            <div className="text-lg font-mono font-bold text-amber-400">{level}</div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
            <div className="text-lg font-mono font-bold text-white">{score}</div>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(i => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all ${
                  i <= lives ? 'fill-rose-500 text-rose-500 scale-100' : 'text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="relative h-[480px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl">
        {/* Warning Bottom Danger Line */}
        <div className="absolute bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-rose-500/20 via-rose-500/70 to-rose-500/20 animate-pulse" />
        <div className="absolute bottom-2 left-0 right-0 text-center text-[11px] font-bold uppercase tracking-widest text-rose-500/60 pointer-events-none">
          Danger Zone
        </div>

        {/* Falling Bubbles */}
        {bubbles.map(b => {
          const isPartialMatch = currentInput.length > 0 && b.word.toLowerCase().startsWith(currentInput);

          return (
            <div
              key={b.id}
              className={`absolute transform -translate-x-1/2 flex items-center justify-center px-4 py-2 rounded-full font-mono text-sm font-bold shadow-lg transition-transform ${
                isPartialMatch 
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110' 
                  : `bg-gradient-to-r ${b.color} text-white ring-2 ring-white/30`
              }`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
              }}
            >
              {b.word}
            </div>
          );
        })}

        {/* Live Input Indicator at bottom center */}
        {gameState === 'playing' && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-slate-900/90 border border-blue-500/50 shadow-xl flex items-center gap-2">
            <span className="text-xs uppercase text-slate-400 font-semibold">Typing:</span>
            <span className="font-mono text-lg font-black text-blue-400 tracking-wider">
              {currentInput || '...'}
            </span>
          </div>
        )}

        {/* Start / Menu Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mb-4 shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-2">Word Bubbles</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Test your reaction speed! Words in bubbles fall down from the sky. Type them quickly to pop them and earn combo points.
            </p>
            {highScore > 0 && (
              <div className="mb-6 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>High Score: {highScore} pts</span>
              </div>
            )}
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-3xl font-black text-rose-400 tracking-tight mb-1">Game Over</h3>
            <p className="text-sm text-slate-400 mb-6">You popped bubbles like a champion!</p>

            <div className="grid grid-cols-2 gap-4 max-w-xs w-full mb-6">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Final Score</div>
                <div className="text-2xl font-mono font-black text-white">{score}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Best Score</div>
                <div className="text-2xl font-mono font-black text-amber-400">{highScore}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
