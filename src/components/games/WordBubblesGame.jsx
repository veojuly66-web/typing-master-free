import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import { Heart, Trophy, Play, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORD_BANK = [
  'cat', 'dog', 'sun', 'sky', 'sea', 'run', 'fly', 'tree', 'wind', 'fast',
  'jump', 'code', 'type', 'flow', 'speed', 'spark', 'light', 'water', 'dream',
  'swift', 'forest', 'rhythm', 'branch', 'pebble', 'whisper', 'silver', 'bright'
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

  useEffect(() => {
    if (gameState !== 'playing') return;

    let isMounted = true;

    const loop = () => {
      const now = Date.now();
      const spawnInterval = Math.max(1200, 2600 - level * 200);

      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const word = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
        const newBubble = {
          id: nextIdRef.current++,
          word,
          x: Math.floor(12 + Math.random() * 76),
          y: 0,
          speed: 0.16 + (level * 0.04) + (Math.random() * 0.06)
        };
        setBubbles(prev => [...prev, newBubble]);
      }

      setBubbles(prev => {
        const next = [];
        let lostLife = false;

        for (const b of prev) {
          const newY = b.y + b.speed;
          if (newY >= 88) {
            lostLife = true;
          } else {
            next.push({ ...b, y: newY });
          }
        }

        if (lostLife) {
          soundManager.playError();
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              endGame();
              return 0;
            }
            return nextL;
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
        confetti({ particleCount: 50, spread: 60 });
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

      const matchedIdx = bubbles.findIndex(b => b.word.toLowerCase() === nextInput);

      if (matchedIdx !== -1) {
        soundManager.playBubblePop();
        const matched = bubbles[matchedIdx];
        setBubbles(prev => prev.filter(b => b.id !== matched.id));
        setCurrentInput('');

        setScore(prev => {
          const added = 100 + matched.word.length * 20;
          const newScore = prev + added;
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
      className="max-w-4xl mx-auto py-4 select-none"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -z-10"
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between bg-paper-surface border border-paper-border rounded-card p-4 mb-4 shadow-subtle">
        <div>
          <h2 className="text-base font-semibold text-ink">Word Bubbles</h2>
          <p className="text-xs text-ink-muted">Type the falling words before they reach the ground</p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-ink-muted">Level:</span>{' '}
            <strong className="font-mono text-ink text-sm">{level}</strong>
          </div>

          <div>
            <span className="text-ink-muted">Score:</span>{' '}
            <strong className="font-mono text-accent text-sm">{score}</strong>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map(i => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all ${
                  i <= lives ? 'fill-type-error text-type-error' : 'text-paper-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="relative h-[460px] bg-paper-surface rounded-card border border-paper-border overflow-hidden shadow-subtle">
        {/* Ground Line */}
        <div className="absolute bottom-8 left-0 right-0 h-[1px] bg-paper-border" />
        <div className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-ink-muted">
          Base line
        </div>

        {/* Falling Words */}
        {bubbles.map(b => {
          const isPartialMatch = currentInput.length > 0 && b.word.toLowerCase().startsWith(currentInput);

          return (
            <div
              key={b.id}
              className={`absolute transform -translate-x-1/2 flex items-center justify-center px-3 py-1 rounded-full font-mono text-xs font-medium border shadow-subtle transition-transform ${
                isPartialMatch
                  ? 'bg-accent text-white border-accent scale-105'
                  : 'bg-paper text-ink border-paper-border'
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

        {/* Current typed string */}
        {gameState === 'playing' && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-card bg-paper border border-paper-border flex items-center gap-2 text-xs">
            <span className="text-ink-muted">Input:</span>
            <span className="font-mono font-semibold text-ink text-sm">
              {currentInput || '...'}
            </span>
          </div>
        )}

        {/* Menu Screen */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-paper-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-semibold text-ink mb-2">Word Bubbles</h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mb-6 leading-relaxed">
              Type the descending words before they cross the base line. Each successful word awards points and increases velocity.
            </p>
            {highScore > 0 && (
              <div className="mb-6 px-3 py-1 rounded-btn bg-paper border border-paper-border text-xs text-ink-muted flex items-center gap-1.5 font-mono">
                <Trophy className="w-3.5 h-3.5 text-accent" />
                <span>Best: {highScore} pts</span>
              </div>
            )}
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white font-medium text-xs transition-colors shadow-subtle"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start game</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-paper-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-semibold text-ink mb-1">Game Over</h3>
            <p className="text-xs text-ink-muted mb-6">Clean practice builds faster fingers.</p>

            <div className="grid grid-cols-2 gap-3 max-w-xs w-full mb-6 text-xs">
              <div className="bg-paper border border-paper-border p-3 rounded-card">
                <div className="text-ink-muted mb-0.5">Score</div>
                <div className="text-xl font-mono font-semibold text-ink">{score}</div>
              </div>
              <div className="bg-paper border border-paper-border p-3 rounded-card">
                <div className="text-ink-muted mb-0.5">High Score</div>
                <div className="text-xl font-mono font-semibold text-accent">{highScore}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white font-medium text-xs transition-colors shadow-subtle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
