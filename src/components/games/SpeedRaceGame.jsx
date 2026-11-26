import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import { Storage } from '../../lib/storage';
import { calculateGrossWpm, calculateAccuracy } from '../../lib/stats';
import { Button, Card, Badge, StatNumber } from '../ui';
import { Trophy, Play, RotateCcw, Flag } from 'lucide-react';
import confetti from 'canvas-confetti';

const RACE_WORDS = [
  'swift', 'engine', 'speed', 'racer', 'track', 'vector', 'stride',
  'motion', 'pedal', 'turbo', 'spark', 'wheel', 'drift', 'clutch',
  'piston', 'torque', 'chime', 'glider', 'corner', 'sprint', 'finish'
];

export default function SpeedRaceGame({ onBack }) {
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'countdown' | 'racing' | 'finished'
  const [countdown, setCountdown] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [userProgress, setUserProgress] = useState(0); // 0 to 100%
  const [errorsCount, setErrorsCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finalStats, setFinalStats] = useState(null);

  // 3 Computer opponents
  const [opponents, setOpponents] = useState([
    { id: 1, name: 'Comet (Bot)', progress: 0, speedFactor: 0.88, color: '#3B82F6' },
    { id: 2, name: 'Volt (Bot)', progress: 0, speedFactor: 1.02, color: '#F59E0B' },
    { id: 3, name: 'Aero (Bot)', progress: 0, speedFactor: 0.95, color: '#8B5CF6' }
  ]);

  const inputRef = useRef(null);
  const raceWords = RACE_WORDS.slice(0, 15);
  const currentWord = raceWords[wordIndex] || '';

  // Start countdown
  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    setUserProgress(0);
    setWordIndex(0);
    setCurrentInput('');
    setErrorsCount(0);
    setFinalStats(null);
    setOpponents([
      { id: 1, name: 'Comet (Bot)', progress: 0, speedFactor: 0.88, color: '#3B82F6' },
      { id: 2, name: 'Volt (Bot)', progress: 0, speedFactor: 1.02, color: '#F59E0B' },
      { id: 3, name: 'Aero (Bot)', progress: 0, speedFactor: 0.95, color: '#8B5CF6' }
    ]);

    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          startRace();
          return 0;
        }
        return prev - 1;
      });
    }, 800);
  };

  const startRace = () => {
    setGameState('racing');
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Bot progress animation loop
  useEffect(() => {
    if (gameState !== 'racing') return;

    const interval = setInterval(() => {
      setOpponents(prev => {
        return prev.map(bot => {
          // Jitter speed slightly for organic feel
          const step = (0.45 * bot.speedFactor) + (Math.random() * 0.2);
          const nextProg = Math.min(100, bot.progress + step);
          return { ...bot, progress: nextProg };
        });
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameState]);

  // Handle typing inside race
  const handleKeyDown = (e) => {
    if (gameState !== 'racing') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      setCurrentInput(prev => prev.slice(0, -1));
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      // Check if current word matches
      if (currentInput.trim().toLowerCase() === currentWord.toLowerCase()) {
        soundManager.playKeypress('a');
        const nextIdx = wordIndex + 1;
        const newProgress = Math.min(100, Math.round((nextIdx / raceWords.length) * 100));
        setUserProgress(newProgress);
        setWordIndex(nextIdx);
        setCurrentInput('');

        if (nextIdx >= raceWords.length) {
          finishRace(newProgress);
        }
      } else {
        soundManager.playError();
        setErrorsCount(prev => prev + 1);
      }
      return;
    }

    if (e.key.length === 1) {
      const nextStr = currentInput + e.key;
      setCurrentInput(nextStr);

      // Check if user completed the word directly
      if (nextStr.trim().toLowerCase() === currentWord.toLowerCase()) {
        soundManager.playKeypress(e.key);
        const nextIdx = wordIndex + 1;
        const newProgress = Math.min(100, Math.round((nextIdx / raceWords.length) * 100));
        setUserProgress(newProgress);
        setWordIndex(nextIdx);
        setCurrentInput('');

        if (nextIdx >= raceWords.length) {
          finishRace(newProgress);
        }
      } else {
        soundManager.playKeypress(e.key);
      }
    }
  };

  const finishRace = (finalProgress) => {
    const elapsed = Math.max((Date.now() - (startTime || Date.now())) / 1000, 1);
    const minutes = elapsed / 60;
    const totalChars = raceWords.join(' ').length;
    const wpm = calculateGrossWpm(totalChars, minutes);
    const acc = calculateAccuracy(totalChars, totalChars + errorsCount);

    // Determine place
    const allRacers = [
      { name: 'You', progress: finalProgress },
      ...opponents
    ].sort((a, b) => b.progress - a.progress);

    const userPlace = allRacers.findIndex(r => r.name === 'You') + 1;

    setFinalStats({
      wpm,
      accuracy: acc,
      timeSeconds: Math.round(elapsed),
      place: userPlace
    });

    setGameState('finished');
    if (userPlace === 1) {
      soundManager.playSuccess();
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  return (
    <div
      className="max-w-typing mx-auto py-4 select-none"
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
      <div className="flex items-center justify-between bg-surface border border-border rounded-card p-4 mb-4 shadow-subtle">
        <div>
          <h2 className="text-base font-semibold text-text">Speed Race</h2>
          <p className="text-xs text-text-muted">Type the displayed words to accelerate your car</p>
        </div>

        {gameState === 'racing' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Target word:</span>
            <span className="font-mono text-base font-semibold text-accent px-2.5 py-0.5 rounded-btn bg-accent-soft">
              {currentWord}
            </span>
          </div>
        )}
      </div>

      {/* 4-Lane Race Track */}
      <Card className="p-4 sm:p-6 mb-4 space-y-4">
        {/* User Lane (Lane 1) */}
        <div>
          <div className="flex items-center justify-between text-2xs font-semibold mb-1">
            <span className="text-accent flex items-center gap-1">
              <span>Lane 1: You</span>
              <Badge variant="accent">Player</Badge>
            </span>
            <span className="font-mono text-text-muted">{userProgress}%</span>
          </div>
          <div className="relative w-full h-8 bg-surface-2 border border-border rounded-btn overflow-hidden flex items-center px-1">
            <div className="absolute right-2 top-0 bottom-0 flex items-center text-text-muted/40">
              <Flag className="w-4 h-4" />
            </div>
            <div
              className="absolute left-1 h-6 px-2 rounded-btn bg-accent text-white font-mono text-2xs font-bold flex items-center justify-center transition-all duration-150 shadow-subtle"
              style={{ left: `calc(${userProgress}% * 0.88)` }}
            >
              🏎 You
            </div>
          </div>
        </div>

        {/* Opponent Lanes */}
        {opponents.map((bot, bIdx) => (
          <div key={bot.id}>
            <div className="flex items-center justify-between text-2xs text-text-muted font-medium mb-1">
              <span>Lane {bIdx + 2}: {bot.name}</span>
              <span className="font-mono">{Math.round(bot.progress)}%</span>
            </div>
            <div className="relative w-full h-8 bg-surface-2 border border-border rounded-btn overflow-hidden flex items-center px-1">
              <div className="absolute right-2 top-0 bottom-0 flex items-center text-text-muted/40">
                <Flag className="w-4 h-4" />
              </div>
              <div
                className="absolute left-1 h-6 px-2 rounded-btn bg-surface border border-border text-text font-mono text-2xs font-medium flex items-center justify-center transition-all duration-200"
                style={{ left: `calc(${bot.progress}% * 0.88)` }}
              >
                🚗 {bot.name.split(' ')[0]}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Input Box while racing */}
        {gameState === 'racing' && (
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Type:</span>
              <span className="font-mono text-base text-text bg-surface-2 px-3 py-1 rounded-btn border border-border">
                {currentInput || '...'}
              </span>
            </div>
            <span className="text-2xs text-text-muted font-mono">
              Word {wordIndex + 1} of {raceWords.length}
            </span>
          </div>
        )}
      </Card>

      {/* Menu / Countdown / Finished Overlays */}
      {gameState === 'menu' && (
        <Card className="text-center p-8">
          <h3 className="text-2xl font-semibold text-text mb-2">Ready to Race?</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mb-6 leading-relaxed">
            Race against 3 computer drivers. Type each word accurately to propel your racer across the finish line.
          </p>
          <Button variant="primary" onClick={startCountdown}>
            <Play className="w-4 h-4" />
            <span>Start Race</span>
          </Button>
        </Card>
      )}

      {gameState === 'countdown' && (
        <Card className="text-center p-12">
          <div className="font-mono text-6xl font-bold text-accent animate-bounce">
            {countdown === 0 ? 'GO!' : countdown}
          </div>
          <p className="text-xs text-text-muted mt-2">Get ready on the home row</p>
        </Card>
      )}

      {gameState === 'finished' && finalStats && (
        <Card className="text-center p-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-card bg-accent-soft text-accent flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-text mb-1">
            {finalStats.place === 1 ? '1st Place! Victory!' : `${finalStats.place}th Place Finish`}
          </h3>
          <p className="text-xs text-text-muted mb-6">
            {finalStats.place === 1 ? 'Flawless cadence and speed!' : 'Great run! Retake the race to claim first place.'}
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
            <StatNumber value={finalStats.wpm} label="Speed" unit="WPM" accent />
            <StatNumber value={`${finalStats.accuracy}%`} label="Accuracy" />
            <StatNumber value={`${finalStats.timeSeconds}s`} label="Time" />
          </div>

          <Button variant="primary" onClick={startCountdown}>
            <RotateCcw className="w-4 h-4" />
            <span>Race Again</span>
          </Button>
        </Card>
      )}
    </div>
  );
}
