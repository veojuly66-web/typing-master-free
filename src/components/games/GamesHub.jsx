import React, { useState } from 'react';
import WordBubblesGame from './WordBubblesGame';
import WordAttackGame from './WordAttackGame';
import SpeedRaceGame from './SpeedRaceGame';
import { Card, Button, Badge } from '../ui';
import { useAuth } from '../../lib/auth';
import ProLock from '../ui/ProLock';
import { ArrowLeft, Play, Lock, Sparkles, X } from 'lucide-react';

export default function GamesHub() {
  const [activeGame, setActiveGame] = useState(null); // 'bubbles' | 'attack' | 'race' | null
  const { isProUser } = useAuth();
  const [proModalGame, setProModalGame] = useState(null);

  const handleLaunchGame = (gameId, isPro = false) => {
    if (isPro && !isProUser) {
      setProModalGame(gameId);
      return;
    }
    setActiveGame(gameId);
  };

  if (activeGame === 'bubbles') {
    return (
      <div className="max-w-content mx-auto py-6 px-4">
        <Button
          size="sm"
          variant="secondary"
          className="mb-4"
          onClick={() => setActiveGame(null)}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Games</span>
        </Button>
        <WordBubblesGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'attack') {
    return (
      <div className="max-w-content mx-auto py-6 px-4">
        <Button
          size="sm"
          variant="secondary"
          className="mb-4"
          onClick={() => setActiveGame(null)}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Games</span>
        </Button>
        <WordAttackGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'race') {
    return (
      <div className="max-w-content mx-auto py-6 px-4">
        <Button
          size="sm"
          variant="secondary"
          className="mb-4"
          onClick={() => setActiveGame(null)}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Games</span>
        </Button>
        <SpeedRaceGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
              Typing Arcade Games
            </h1>
            <p className="text-sm sm:text-base text-text-muted max-w-2xl">
              Sharpen reaction time, peripheral letter recognition, and word-burst speed through interactive typing practice.
            </p>
          </div>

          <div className="shrink-0">
            <span className="text-xs px-2.5 py-1 rounded bg-surface-2 border border-border text-text-muted font-medium inline-flex items-center gap-1.5">
              <span>Word Bubbles (Free) · Defense &amp; Race (Pro)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game 1: Word Bubbles (FREE) */}
        <Card className="flex flex-col justify-between" hover>
          <div>
            <div className="h-32 rounded-btn bg-surface-2 border border-border flex flex-col items-center justify-center p-4 mb-4 select-none relative">
              <div className="flex gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-surface border border-border font-mono text-xs text-text shadow-subtle">
                  cloud
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 font-mono text-xs font-semibold">
                  swift
                </span>
              </div>
              <span className="text-2xs text-text-muted font-mono mt-1">Pop words before they drop</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <Badge variant="default">Rhythm &amp; Reflexes</Badge>
              <span className="text-2xs text-text-muted font-mono">
                Best: {localStorage.getItem('tm_bubbles_high') || 0}
              </span>
            </div>

            <h2 className="text-base font-semibold text-text mb-1">
              Word Bubbles
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Words descend at increasing velocities. Type matching words accurately to pop bubbles before they hit the base line.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-2xs text-text-muted">Difficulty: Progressive</span>
            <Button size="sm" variant="primary" onClick={() => handleLaunchGame('bubbles', false)}>
              <Play className="w-3.5 h-3.5" />
              <span>Play Free</span>
            </Button>
          </div>
        </Card>

        {/* Game 2: Word Attack (PRO) */}
        <Card className="flex flex-col justify-between relative" hover>
          <div>
            <div className="h-32 rounded-btn bg-surface-2 border border-border flex flex-col items-center justify-center p-4 mb-4 select-none relative">
              <div className="flex gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-btn bg-surface border border-border font-mono text-xs text-text">
                  vector
                </span>
                <span className="px-2.5 py-0.5 rounded-btn bg-surface border border-error font-mono text-xs text-error">
                  pulse
                </span>
              </div>
              <span className="text-2xs text-text-muted font-mono mt-1">Defend shield integrity</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <Badge variant="default">Action Defense</Badge>
              <div className="flex items-center gap-1.5">
                {!isProUser && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-pro-soft text-pro border border-pro/20">
                    <Lock className="w-2.5 h-2.5" />
                    PRO
                  </span>
                )}
                <span className="text-2xs text-text-muted font-mono">
                  Best: {localStorage.getItem('tm_attack_high') || 0}
                </span>
              </div>
            </div>

            <h2 className="text-base font-semibold text-text mb-1">
              Word Attack: Defender
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Descending targets converge on your core. Strike keys rapidly to neutralize incoming threats before shield breach.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-2xs text-text-muted">Difficulty: Challenging</span>
            <Button
              size="sm"
              variant={!isProUser ? "secondary" : "primary"}
              onClick={() => handleLaunchGame('attack', true)}
              className={!isProUser ? "!border-pro/30 !text-pro" : ""}
            >
              {!isProUser ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-pro" />
                  <span>Unlock Pro</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play</span>
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Game 3: Speed Race (PRO) */}
        <Card className="flex flex-col justify-between relative" hover>
          <div>
            <div className="h-32 rounded-btn bg-surface-2 border border-border flex flex-col items-center justify-center p-4 mb-4 select-none relative">
              <div className="flex flex-col gap-1.5 w-full px-4">
                <div className="h-2 w-3/4 bg-accent rounded-full" />
                <div className="h-2 w-1/2 bg-border rounded-full" />
                <div className="h-2 w-2/3 bg-border rounded-full" />
              </div>
              <span className="text-2xs text-text-muted font-mono mt-3">Race against 3 computer drivers</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <Badge variant="accent">Multi-Lane</Badge>
              <div className="flex items-center gap-1.5">
                {!isProUser && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-pro-soft text-pro border border-pro/20">
                    <Lock className="w-2.5 h-2.5" />
                    PRO
                  </span>
                )}
                <span className="text-2xs text-text-muted font-mono">
                  3 Competitors
                </span>
              </div>
            </div>

            <h2 className="text-base font-semibold text-text mb-1">
              Speed Race
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Race 3 computer cars calibrated to test your speed stamina. Type each word cleanly to accelerate across the finish line.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-2xs text-text-muted">Difficulty: Competitive</span>
            <Button
              size="sm"
              variant={!isProUser ? "secondary" : "primary"}
              onClick={() => handleLaunchGame('race', true)}
              className={!isProUser ? "!border-pro/30 !text-pro" : ""}
            >
              {!isProUser ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-pro" />
                  <span>Unlock Pro</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Pro Modal for Games */}
      {proModalGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full bg-surface border border-border rounded-card p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setProModalGame(null)}
              className="absolute top-4 right-4 p-1 rounded-btn hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <ProLock
              title="Unlock All Arcade Games with Pro"
              description="Word Attack and Speed Race are exclusive to Pro subscribers. Upgrade or start your 7-day free trial to get unlimited access to all games, Hindi lessons, and exam simulators."
              onUnlock={() => {
                setProModalGame(null);
                window.location.hash = '#/pricing';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
