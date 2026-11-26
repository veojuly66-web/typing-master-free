import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import { Trophy, Play, RotateCcw, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

const ATTACK_WORDS = [
  'void', 'beam', 'core', 'ship', 'star', 'bolt', 'flux',
  'pulse', 'laser', 'shield', 'orbit', 'matrix', 'vector', 'blaster', 'gravity',
  'quantum', 'system', 'binary', 'signal', 'packet', 'router', 'server'
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

      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const word = ATTACK_WORDS[Math.floor(Math.random() * ATTACK_WORDS.length)];
        const newEnemy = {
          id: nextIdRef.current++,
          word,
          x: Math.floor(10 + Math.random() * 80),
          y: 0,
          speed: 0.18 + (wave * 0.04)
        };
        setEnemies(prev => [...prev, newEnemy]);
      }

      setEnemies(prev => {
        const next = [];
        let hit = false;

        for (const en of prev) {
          const newY = en.y + en.speed;
          if (newY >= 86) {
            hit = true;
          } else {
            next.push({ ...en, y: newY });
          }
        }

        if (hit) {
          soundManager.playError();
          setShield(s => {
            const nextS = Math.max(0, s - 25);
            if (nextS <= 0) {
              endGame();
              return 0;
            }
            return nextS;
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

      {/* Header */}
      <div className="flex items-center justify-between bg-paper-surface border border-paper-border rounded-card p-4 mb-4 shadow-subtle">
        <div>
          <h2 className="text-base font-semibold text-ink">Word Attack: Defender</h2>
          <p className="text-xs text-ink-muted">Type fast to neutralize descending targets</p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-ink-muted">Wave:</span>{' '}
            <strong className="font-mono text-ink text-sm">{wave}</strong>
          </div>

          <div>
            <span className="text-ink-muted">Score:</span>{' '}
            <strong className="font-mono text-accent text-sm">{score}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Shield className={`w-4 h-4 ${shield > 25 ? 'text-accent' : 'text-type-error'}`} />
            <div className="w-20 bg-paper border border-paper-border rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  shield > 40 ? 'bg-accent' : 'bg-type-error'
                }`}
                style={{ width: `${shield}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="relative h-[460px] bg-paper-surface rounded-card border border-paper-border overflow-hidden shadow-subtle">
        {/* Shield line at base */}
        <div className="absolute bottom-8 left-0 right-0 h-[1px] bg-accent/40" />
        <div className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-ink-muted">
          Defense perimeter
        </div>

        {/* Enemies */}
        {enemies.map(en => {
          const isMatched = currentInput.length > 0 && en.word.toLowerCase().startsWith(currentInput);

          return (
            <div
              key={en.id}
              className={`absolute transform -translate-x-1/2 flex items-center justify-center px-3 py-1 rounded-btn font-mono text-xs border transition-all ${
                isMatched
                  ? 'bg-accent text-white border-accent scale-105'
                  : 'bg-paper text-ink border-paper-border'
              }`}
              style={{
                left: `${en.x}%`,
                top: `${en.y}%`,
              }}
            >
              <span>{en.word}</span>
            </div>
          );
        })}

        {/* Current Input */}
        {gameState === 'playing' && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-card bg-paper border border-paper-border flex items-center gap-2 text-xs">
            <span className="text-ink-muted">Target:</span>
            <span className="font-mono font-semibold text-ink text-sm">
              {currentInput || '...'}
            </span>
          </div>
        )}

        {/* Menu Screen */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-paper-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-semibold text-ink mb-2">Word Attack</h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mb-6 leading-relaxed">
              Maintain focus under pressure. Targets advance toward your defense perimeter. Type each word to clear it before impact.
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
              <span>Start defense</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-paper-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-semibold text-ink mb-1">Defense Compromised</h3>
            <p className="text-xs text-ink-muted mb-6">Each round trains your finger reflexes.</p>

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
              <span>Try again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
