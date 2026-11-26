import React, { useState } from 'react';
import WordBubblesGame from './WordBubblesGame';
import WordAttackGame from './WordAttackGame';
import { ArrowLeft, Play } from 'lucide-react';

export default function GamesHub() {
  const [activeGame, setActiveGame] = useState(null); // 'bubbles' | 'attack' | null

  if (activeGame === 'bubbles') {
    return (
      <div className="max-w-content mx-auto py-6 px-4">
        <button
          type="button"
          onClick={() => setActiveGame(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border text-ink-muted hover:text-ink text-xs font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Games</span>
        </button>
        <WordBubblesGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'attack') {
    return (
      <div className="max-w-content mx-auto py-6 px-4">
        <button
          type="button"
          onClick={() => setActiveGame(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border text-ink-muted hover:text-ink text-xs font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Games</span>
        </button>
        <WordAttackGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-2">
          Typing Games
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
          Sharpen reaction time, peripheral letter recognition, and word-burst speed through interactive typing practice.
        </p>
      </div>

      {/* 2 Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game 1: Word Bubbles */}
        <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle flex flex-col justify-between">
          <div>
            {/* Visual Preview / Thumbnail */}
            <div className="h-36 rounded-card bg-paper border border-paper-border flex flex-col items-center justify-center p-4 mb-5 relative overflow-hidden select-none">
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-paper-surface border border-paper-border font-mono text-xs text-ink shadow-subtle">
                  cloud
                </span>
                <span className="px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/30 font-mono text-xs font-semibold">
                  swift
                </span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-paper-surface border border-paper-border font-mono text-xs text-ink shadow-subtle">
                  stream
                </span>
              </div>
              <div className="absolute bottom-2 text-[10px] text-ink-muted font-mono">
                Type words before they touch the bottom
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-paper border border-paper-border text-ink-muted font-medium">
                Reaction &amp; Rhythm
              </span>
              <span className="text-xs text-ink-muted font-mono">
                High score: {localStorage.getItem('tm_bubbles_high') || 0}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-ink mb-1.5">
              Word Bubbles
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Words descend at increasing velocities. Type matching words accurately to pop bubbles before they hit the base line.
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-paper-border flex items-center justify-between">
            <span className="text-xs text-ink-muted">Difficulty: Progressive</span>
            <button
              type="button"
              onClick={() => setActiveGame('bubbles')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-subtle"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Bubbles</span>
            </button>
          </div>
        </div>

        {/* Game 2: Word Attack */}
        <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle flex flex-col justify-between">
          <div>
            {/* Visual Preview / Thumbnail */}
            <div className="h-36 rounded-card bg-paper border border-paper-border flex flex-col items-center justify-center p-4 mb-5 relative overflow-hidden select-none">
              <div className="flex gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-btn bg-paper-surface border border-paper-border font-mono text-xs text-ink">
                  laser
                </span>
                <span className="px-2.5 py-1 rounded-btn bg-paper-surface border border-type-error font-mono text-xs text-type-error">
                  pulse
                </span>
              </div>
              <div className="w-48 h-0.5 bg-accent/40 rounded-full" />
              <div className="absolute bottom-2 text-[10px] text-ink-muted font-mono">
                Defend the core shield
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-paper border border-paper-border text-ink-muted font-medium">
                Speed Defense
              </span>
              <span className="text-xs text-ink-muted font-mono">
                High score: {localStorage.getItem('tm_attack_high') || 0}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-ink mb-1.5">
              Word Attack: Defender
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Descending drones target your perimeter. Strike keys rapidly to eliminate incoming targets before shield integrity is compromised.
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-paper-border flex items-center justify-between">
            <span className="text-xs text-ink-muted">Difficulty: Challenging</span>
            <button
              type="button"
              onClick={() => setActiveGame('attack')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-subtle"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Defender</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
