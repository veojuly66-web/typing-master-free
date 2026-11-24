import React, { useState } from 'react';
import WordBubblesGame from './WordBubblesGame';
import WordAttackGame from './WordAttackGame';
import { Gamepad2, Sparkles, Crosshair, ArrowLeft, Trophy } from 'lucide-react';

export default function GamesHub() {
  const [activeGame, setActiveGame] = useState(null); // 'bubbles' | 'attack' | null

  if (activeGame === 'bubbles') {
    return (
      <div>
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <button
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Games Hub</span>
          </button>
        </div>
        <WordBubblesGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'attack') {
    return (
      <div>
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <button
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Games Hub</span>
          </button>
        </div>
        <WordAttackGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 p-8 rounded-3xl border border-purple-500/20 shadow-2xl mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-500/30">
          <Gamepad2 className="w-4 h-4 text-purple-400" />
          <span>Pankaj Typing Classic Arcade</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Learn While Playing
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl mx-auto">
          Sharpen your touch typing reflexes, reaction speed, and peripheral letter recognition with classic Pankaj Typing mini-games.
        </p>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game 1: Word Bubbles */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-xl group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
              Classic Arcade
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Word Bubbles</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Words float down in colorful bubbles. Type the matching word to pop them before they hit the bottom border. Fast and thrilling!
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Difficulty: Progressive</span>
            <button
              onClick={() => setActiveGame('bubbles')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
            >
              Play Bubbles
            </button>
          </div>
        </div>

        {/* Game 2: Word Attack */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-xl group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Crosshair className="w-7 h-7" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
              Action Defender
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Word Attack: Defender</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Alien invasion! Descending drones are targeting your power core. Type words to fire pulse lasers and destroy them before impact.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Difficulty: Hard</span>
            <button
              onClick={() => setActiveGame('attack')}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              Play Word Attack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
