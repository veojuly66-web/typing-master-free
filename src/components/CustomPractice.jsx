import React, { useState } from 'react';
import { Edit3, Play, Sparkles, Code, FileText, Quote } from 'lucide-react';

const PRESETS = [
  {
    title: 'Technology & AI',
    icon: Sparkles,
    text: 'Artificial intelligence and neural network architectures are transforming the landscape of computational science. Machine learning algorithms analyze vast datasets to detect intricate patterns that human observers might overlook.'
  },
  {
    title: 'JavaScript Code',
    icon: Code,
    text: 'const calculateVelocity = (distance, time) => { if (time <= 0) return 0; const speed = distance / time; return Number(speed.toFixed(2)); };'
  },
  {
    title: 'Inspirational Wisdom',
    icon: Quote,
    text: 'Do not wait for extraordinary circumstances to do good actions; try to use ordinary situations. Success is the sum of small efforts, repeated day in and day out.'
  },
  {
    title: 'Speed Warmup Drill',
    icon: FileText,
    text: 'pack my box with five dozen liquor jugs. sphinx of black quartz judge my vow. how razorback-jumping frogs can level six piqued gymnasts.'
  }
];

export default function CustomPractice({ onStartCustom }) {
  const [customText, setCustomText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleApplyPreset = (preset) => {
    setSelectedPreset(preset.title);
    setCustomText(preset.text);
  };

  const handleStart = () => {
    const cleaned = customText.trim().replace(/\s+/g, ' ');
    if (cleaned.length < 5) return;
    onStartCustom({
      id: 'custom-' + Date.now(),
      title: 'Custom Practice Session',
      intro: 'Practice typing your custom text with live keyboard and finger placement feedback.',
      targetWpm: 35,
      targetAccuracy: 95,
      content: cleaned
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 p-8 rounded-3xl border border-blue-500/20 shadow-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/30">
          <Edit3 className="w-4 h-4 text-blue-400" />
          <span>Custom Text Studio</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Custom Typing Practice
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-xl">
          Paste your own text, homework, code snippets, or articles to practice with the full Pankaj Typing engine.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Preset Snippets:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPreset === preset.title;
            return (
              <button
                key={preset.title}
                onClick={() => handleApplyPreset(preset)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg text-white'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 text-blue-400 mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">{preset.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{preset.text}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Area Input */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Paste or type your text below:
        </label>
        <textarea
          rows={6}
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            setSelectedPreset(null);
          }}
          placeholder="Paste any article, paragraph, or code snippet you want to practice typing..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            {customText.length} characters • ~{Math.round(customText.length / 5)} words
          </div>

          <button
            onClick={handleStart}
            disabled={customText.trim().length < 5}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Exercise</span>
          </button>
        </div>
      </div>
    </div>
  );
}
