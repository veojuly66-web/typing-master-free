import React, { useState } from 'react';
import { Storage } from '../lib/storage';
import { rankWeakKeys } from '../lib/stats';
import { Card, Button, Tabs, Badge } from './ui';
import { Keyboard, Code, FileText, Target, Play, Hash } from 'lucide-react';

const COMMON_DRILLS = [
  {
    id: 'drill-bigrams',
    title: 'High-Frequency Bigrams',
    category: 'Speed Drills',
    icon: Keyboard,
    text: 'th he in er an re nd at on nt en ha to ti is or es te et me se ar al te co de ro li ra ri'
  },
  {
    id: 'drill-common-200',
    title: 'Top 100 Core Words',
    category: 'Vocabulary',
    icon: Target,
    text: 'the of and a to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up other about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find'
  },
  {
    id: 'drill-numbers',
    title: 'Top Number Row Practice',
    category: 'Numbers',
    icon: Hash,
    text: '12 34 56 78 90 2026 1984 404 100 99 75 50 25 10 1024 2048 4096 8192 144 288 576 1122 3344 5566 7788 9900'
  },
  {
    id: 'drill-symbols',
    title: 'Brackets & Code Symbols',
    category: 'Programming',
    icon: Code,
    text: '{ [ ( ) ] } < > ; : " \' / \\ | _ - + = ! @ # $ % ^ & * ~ ` (a + b) * [c - d] { x: 10, y: 20 }'
  },
  {
    id: 'drill-js',
    title: 'JavaScript Async / Await',
    category: 'Code',
    icon: Code,
    text: 'const fetchData = async (url) => { try { const res = await fetch(url); if (!res.ok) throw new Error("HTTP error"); return await res.json(); } catch (err) { console.error(err); } };'
  },
  {
    id: 'drill-python',
    title: 'Python List Comprehension',
    category: 'Code',
    icon: Code,
    text: 'def filter_evens(numbers: list[int]) -> list[int]: return [n for n in numbers if n % 2 == 0 and n > 0]'
  }
];

// Word dictionary for generating smart adaptive exercises
const ADAPTIVE_WORD_MAP = {
  'a': ['area', 'away', 'ahead', 'apple', 'again', 'about', 'after'],
  'b': ['bright', 'branch', 'bubble', 'before', 'between', 'bridge'],
  'c': ['clear', 'circle', 'candle', 'copper', 'corner', 'current'],
  'd': ['direct', 'drift', 'decide', 'dollar', 'during', 'depend'],
  'e': ['effort', 'energy', 'either', 'engine', 'enough', 'extend'],
  'f': ['forest', 'future', 'fluent', 'finger', 'flight', 'factor'],
  'g': ['gentle', 'golden', 'ground', 'glider', 'gather', 'glance'],
  'h': ['honest', 'harbor', 'happen', 'height', 'handle', 'humble'],
  'i': ['island', 'insect', 'impact', 'invent', 'intend', 'inside'],
  'j': ['journey', 'jungle', 'junior', 'jacket', 'joyful', 'judged'],
  'k': ['kitchen', 'knight', 'kitten', 'kernel', 'keyboard', 'keenly'],
  'l': ['listen', 'little', 'length', 'layout', 'liquid', 'lively'],
  'm': ['moment', 'modern', 'muscle', 'motion', 'melody', 'marble'],
  'n': ['nature', 'narrow', 'needle', 'notice', 'normal', 'number'],
  'o': ['orange', 'object', 'office', 'origin', 'opened', 'online'],
  'p': ['pebble', 'planet', 'portal', 'person', 'proper', 'pencil'],
  'q': ['quiet', 'quick', 'quaint', 'quartz', 'quench', 'quiver'],
  'r': ['rhythm', 'record', 'reason', 'ripple', 'robust', 'relief'],
  's': ['silver', 'spring', 'stream', 'silent', 'stride', 'smooth'],
  't': ['timber', 'travel', 'theory', 'talent', 'target', 'thread'],
  'u': ['unique', 'urgent', 'update', 'useful', 'unwrap', 'uplift'],
  'v': ['valley', 'vector', 'vision', 'volume', 'velvet', 'vertex'],
  'w': ['window', 'wonder', 'whisper', 'winter', 'wooden', 'warmth'],
  'x': ['exact', 'expand', 'export', 'matrix', 'syntax', 'vertex'],
  'y': ['yellow', 'yearly', 'yields', 'yester', 'yonder', 'youths'],
  'z': ['zenith', 'zigzag', 'zephyr', 'zeroes', 'zipper', 'zodiac']
};

export default function AdaptivePractice({ onStartCustom }) {
  const [activeTab, setActiveTab] = useState('smart'); // 'smart' | 'drills' | 'custom'
  const [customText, setCustomText] = useState('');
  const [stripPunctuation, setStripPunctuation] = useState(false);
  const [forceLowercase, setForceLowercase] = useState(false);

  // Identify weak keys
  const keyStats = Storage.getKeyStats();
  const weakKeys = rankWeakKeys(keyStats, 4);
  const focusKeyLetters = weakKeys.length > 0 ? weakKeys.map(k => k.key.toUpperCase()) : ['R', 'U', 'B', 'P'];

  // Generate adaptive text
  const generateAdaptiveText = () => {
    const keys = weakKeys.length > 0 ? weakKeys.map(k => k.key.toLowerCase()) : ['r', 'u', 'b', 'p'];
    const chosenWords = [];

    // Gather words rich in the weak keys
    for (let i = 0; i < 30; i++) {
      const k = keys[i % keys.length];
      const list = ADAPTIVE_WORD_MAP[k] || ['practice', 'typing', 'cadence', 'rhythm'];
      const word = list[Math.floor(Math.random() * list.length)];
      chosenWords.push(word);
    }

    return chosenWords.join(' ') + '.';
  };

  const handleStartSmart = () => {
    const text = generateAdaptiveText();
    onStartCustom({
      id: 'smart-' + Date.now(),
      title: `Adaptive Focus: ${focusKeyLetters.join(', ')}`,
      intro: `Targeted practice weighted toward your weakest keys: ${focusKeyLetters.join(', ')}. Keep error rates low.`,
      targetWpm: 35,
      targetAccuracy: 95,
      content: text
    });
  };

  const handleStartDrill = (drill) => {
    onStartCustom({
      id: drill.id + '-' + Date.now(),
      title: drill.title,
      intro: `Specialized skill drill: ${drill.title}.`,
      targetWpm: 35,
      targetAccuracy: 95,
      content: drill.text
    });
  };

  const handleStartCustom = () => {
    let cleaned = customText.trim().replace(/\s+/g, ' ');
    if (stripPunctuation) {
      cleaned = cleaned.replace(/[^\w\s]/g, '');
    }
    if (forceLowercase) {
      cleaned = cleaned.toLowerCase();
    }
    if (cleaned.length < 5) return;

    onStartCustom({
      id: 'custom-' + Date.now(),
      title: 'Custom Practice Session',
      intro: 'Practice your own text with live finger placement guidance and error discipline.',
      targetWpm: 35,
      targetAccuracy: 95,
      content: cleaned
    });
  };

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
          Practice Studio
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-2xl">
          Strengthen weak keys, practice curated typing drills, or paste your own study text and code.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <Tabs
          tabs={[
            { id: 'smart', label: 'Adaptive Practice', icon: Keyboard },
            { id: 'drills', label: 'Curated Drills', icon: Target },
            { id: 'custom', label: 'Custom Text', icon: FileText }
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Tab 1: Smart Adaptive Practice */}
      {activeTab === 'smart' && (
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="accent">Adaptive Algorithm</Badge>
                <span className="text-xs text-text-muted font-mono">Keybr-style</span>
              </div>
              <h2 className="text-lg font-semibold text-text">Targeted Weak-Key Training</h2>
              <p className="text-xs text-text-muted mt-1 max-w-xl">
                We analyze your keystroke latencies and error logs across all sessions to generate drills that target your most hesitant letters.
              </p>
            </div>

            <Button variant="primary" onClick={handleStartSmart}>
              <Play className="w-4 h-4" strokeWidth={1.5} />
              <span>Start Adaptive Drill</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {focusKeyLetters.map((keyLetter, idx) => (
              <div key={idx} className="p-4 rounded-card bg-surface-2 border border-border">
                <div className="text-xs font-medium text-text-muted mb-2">Focus key {idx + 1}</div>
                <div className="keycap inline-flex items-center justify-center w-9 h-9 font-mono text-base font-medium text-accent">{keyLetter}</div>
                <div className="text-2xs text-text-muted mt-2">Weighted into generation</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-text-muted">
            Tip: Complete at least 3 lessons or speed tests so the algorithm builds a rich profile of your key strike patterns.
          </p>
        </Card>
      )}

      {/* Tab 2: Curated Drills */}
      {activeTab === 'drills' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMON_DRILLS.map((drill) => {
            const Icon = drill.icon;
            return (
              <Card key={drill.id} className="flex flex-col justify-between" hover>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">{drill.category}</Badge>
                    <Icon className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-text mb-1">{drill.title}</h3>
                  <p className="text-xs text-text-muted font-mono line-clamp-3 bg-surface-2 p-2.5 rounded-btn border border-border mb-4">
                    {drill.text}
                  </p>
                </div>

                <Button size="sm" variant="secondary" onClick={() => handleStartDrill(drill)}>
                  <Play className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Practice drill</span>
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab 3: Custom Text */}
      {activeTab === 'custom' && (
        <Card className="p-6 sm:p-8">
          <label htmlFor="custom-practice-text" className="block text-xs font-medium text-text-muted mb-2">
            Paste or enter custom text
          </label>
          <textarea
            id="custom-practice-text"
            rows={7}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste book excerpts, homework, code, or personal writing here..."
            className="w-full p-4 rounded-card bg-bg border border-border text-text font-mono text-sm leading-relaxed focus:outline-none focus:border-accent resize-none mb-4"
          />

          {/* Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text">
                <input
                  type="checkbox"
                  checked={stripPunctuation}
                  onChange={(e) => setStripPunctuation(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Remove punctuation</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text">
                <input
                  type="checkbox"
                  checked={forceLowercase}
                  onChange={(e) => setForceLowercase(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Force all lowercase</span>
              </label>
            </div>

            <Button
              variant="primary"
              disabled={customText.trim().length < 5}
              onClick={handleStartCustom}
            >
              <Play className="w-4 h-4" />
              <span>Start custom practice</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
