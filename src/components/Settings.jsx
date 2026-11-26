import React, { useState } from 'react';
import { Storage } from '../lib/storage';
import { soundManager } from '../utils/audio';
import { Card, Button, Toggle, Select, showToast } from './ui';
import { Sliders, Volume2, Type, Keyboard, Target, Eye } from 'lucide-react';

export default function Settings({ onThemeChange }) {
  const [settings, setSettings] = useState(Storage.getSettings());

  const update = (partial) => {
    const updated = Storage.updateSettings(partial);
    setSettings(updated);

    // Sync sound manager
    if (partial.soundEnabled !== undefined) {
      soundManager.enabled = partial.soundEnabled;
      soundManager.saveSettings();
    }
    if (partial.soundPack !== undefined) {
      soundManager.soundPack = partial.soundPack;
      soundManager.saveSettings();
      soundManager.playKeypress('a');
    }
    if (partial.soundVolume !== undefined) {
      soundManager.volume = partial.soundVolume;
      soundManager.saveSettings();
    }
    if (partial.theme !== undefined && onThemeChange) {
      onThemeChange(partial.theme);
    }

    showToast('Settings saved', 'accent', 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
          Settings &amp; Preferences
        </h1>
        <p className="text-sm text-text-muted">
          Customize typing behavior, audio acoustics, keyboard layout, and appearance. Stored in your browser.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
            <Type className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text">Typing Surface &amp; Typography</h2>
          </div>

          <div className="space-y-5">
            <Select
              label="Color Theme"
              value={settings.theme}
              onChange={(val) => update({ theme: val })}
              options={[
                { value: 'light', label: 'Calm Light (Default)' },
                { value: 'dark', label: 'Subtle Dark' },
                { value: 'system', label: 'Match Operating System' }
              ]}
            />

            <Select
              label="Typing Font Size"
              value={settings.fontSize.toString()}
              onChange={(val) => update({ fontSize: parseInt(val, 10) })}
              options={[
                { value: '22', label: '22px — Compact' },
                { value: '24', label: '24px — Standard' },
                { value: '26', label: '26px — Comfortable' },
                { value: '28', label: '28px — Large' },
                { value: '32', label: '32px — Extra Large' }
              ]}
            />

            <Select
              label="Caret Style"
              value={settings.caretStyle}
              onChange={(val) => update({ caretStyle: val })}
              options={[
                { value: 'line', label: 'Vertical Line (Default)' },
                { value: 'block', label: 'Block Cursor' },
                { value: 'underline', label: 'Underline Accent' }
              ]}
            />

            <Toggle
              label="Focus Mode"
              description="Fade header and footer to 20% opacity during active typing to minimize distraction."
              checked={settings.focusMode}
              onChange={(val) => update({ focusMode: val })}
            />
          </div>
        </Card>

        {/* Section 2: Typing Engine Rules */}
        <Card className="p-6">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
            <Sliders className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text">Typing Rules &amp; Error Discipline</h2>
          </div>

          <div className="space-y-5">
            <Select
              label="Error Mode"
              value={settings.errorMode}
              onChange={(val) => update({ errorMode: val })}
              options={[
                { value: 'stop', label: 'Stop on Error — Strict discipline (Beginner default)' },
                { value: 'allow', label: 'Allow Errors — Advance and correct with Backspace' },
                { value: 'exam', label: 'Exam Mode — No Backspace allowed' }
              ]}
            />

            <Select
              label="Daily Practice Goal"
              value={settings.dailyGoalMinutes.toString()}
              onChange={(val) => update({ dailyGoalMinutes: parseInt(val, 10) })}
              options={[
                { value: '5', label: '5 minutes / day — Quick maintenance' },
                { value: '10', label: '10 minutes / day — Steady progress (Recommended)' },
                { value: '15', label: '15 minutes / day — Fast track' },
                { value: '30', label: '30 minutes / day — Intensive mastery' }
              ]}
            />

            <Toggle
              label="Show Live Stats"
              description="Display real-time WPM, accuracy, time, and error counters while typing."
              checked={settings.showLiveStats}
              onChange={(val) => update({ showLiveStats: val })}
            />
          </div>
        </Card>

        {/* Section 3: Keyboard & Finger Guide */}
        <Card className="p-6">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
            <Keyboard className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text">Virtual Keyboard Layout</h2>
          </div>

          <div className="space-y-5">
            <Select
              label="Physical Keyboard Standard"
              value={settings.keyboardLayout}
              onChange={(val) => update({ keyboardLayout: val })}
              options={[
                { value: 'us', label: 'US QWERTY Standard' },
                { value: 'uk', label: 'UK QWERTY Standard' }
              ]}
            />

            <Toggle
              label="Display Virtual Keyboard"
              description="Show the responsive on-screen keyboard below the text area."
              checked={settings.showKeyboard}
              onChange={(val) => update({ showKeyboard: val })}
            />

            <Toggle
              label="Pastel Finger Coloring"
              description="Color-code keycaps in subtle pastel tints corresponding to each finger."
              checked={settings.showFingerColors}
              onChange={(val) => update({ showFingerColors: val })}
            />
          </div>
        </Card>

        {/* Section 4: Sound Feedback */}
        <Card className="p-6">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
            <Volume2 className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text">Synthesized Audio Feedback</h2>
          </div>

          <div className="space-y-5">
            <Toggle
              label="Keyboard Audio Effects"
              description="Play tactile audio synthesizer feedback on each key strike."
              checked={settings.soundEnabled}
              onChange={(val) => update({ soundEnabled: val })}
            />

            <Select
              label="Sound Pack"
              value={settings.soundPack}
              onChange={(val) => update({ soundPack: val })}
              options={[
                { value: 'piano', label: 'Grand Piano (Musical Chimes)' },
                { value: 'mechanical', label: 'Mechanical Switch (Crisp Thock)' },
                { value: 'typewriter', label: 'Vintage Typewriter' },
                { value: 'soft', label: 'Soft Gentle Click' }
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
