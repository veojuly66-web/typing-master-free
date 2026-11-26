import React, { useState } from 'react';
import { Play } from 'lucide-react';

const PRESETS = [
  {
    title: 'Technology & Science',
    category: 'Non-fiction',
    text: 'Artificial intelligence and computational methods are transforming research across biology, physics, and computer science. Clear algorithm design and reliable data structures form the backbone of modern software systems.'
  },
  {
    title: 'Clean Code Principles',
    category: 'Programming',
    text: 'const calculateVelocity = (distance, time) => { if (time <= 0) return 0; const speed = distance / time; return Number(speed.toFixed(2)); };'
  },
  {
    title: 'Everyday Wisdom',
    category: 'Literature',
    text: 'Do not wait for extraordinary circumstances to do good actions; try to use ordinary situations. Excellence is the sum of small efforts repeated day in and day out with patience.'
  },
  {
    title: 'Pangram Sprint',
    category: 'Warmup',
    text: 'pack my box with five dozen liquor jugs. sphinx of black quartz judge my vow. the five boxing wizards jump quickly over the lazy brown dog.'
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
      title: selectedPreset || 'Custom Practice',
      intro: 'Practice your own text with live finger placement guidance and error discipline.',
      targetWpm: 35,
      targetAccuracy: 95,
      content: cleaned
    });
  };

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-2">
          Custom Practice
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
          Paste your own text, code snippets, book paragraphs, or study material to practice with real-time feedback.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
          Presets
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.title;
            return (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-4 rounded-card border text-left transition-all ${
                  isSelected
                    ? 'bg-paper-surface border-accent shadow-subtle ring-1 ring-accent'
                    : 'bg-paper-surface border-paper-border hover:border-ink-muted/40'
                }`}
              >
                <div className="text-[11px] text-ink-muted mb-1">{preset.category}</div>
                <h2 className="text-sm font-semibold text-ink mb-1">{preset.title}</h2>
                <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">{preset.text}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Area Card */}
      <div className="bg-paper-surface border border-paper-border rounded-card p-6 sm:p-8 shadow-subtle">
        <label htmlFor="custom-input" className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
          Your custom text:
        </label>
        <textarea
          id="custom-input"
          rows={6}
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            setSelectedPreset(null);
          }}
          placeholder="Paste or type any paragraph here (at least 5 characters)..."
          className="w-full p-4 rounded-card bg-paper border border-paper-border text-ink font-mono text-sm leading-relaxed focus:outline-none focus:border-accent resize-none mb-4"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-xs text-ink-muted font-mono">
            {customText.trim() ? `${customText.trim().split(/\s+/).length} words · ${customText.length} characters` : '0 words'}
          </span>

          <button
            type="button"
            onClick={handleStart}
            disabled={customText.trim().length < 5}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-btn bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-medium transition-colors shadow-subtle"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start custom practice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
