import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import { Volume2, VolumeX, Sun, Moon, Menu, X, Settings as SettingsIcon, Sliders, Check } from 'lucide-react';

export default function Navbar({ currentRoute, isDark, onToggleTheme }) {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.enabled);
  const [soundPack, setSoundPack] = useState(soundManager.soundPack);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dismissMobileWarning, setDismissMobileWarning] = useState(() => {
    try {
      return sessionStorage.getItem('pt_dismiss_mobile_warn') === 'true';
    } catch (e) {
      return false;
    }
  });

  const navItems = [
    { href: '#/lessons', label: 'Lessons', id: 'lessons' },
    { href: '#/test', label: 'Speed Test', id: 'test' },
    { href: '#/games', label: 'Games', id: 'games' },
    { href: '#/practice', label: 'Practice', id: 'practice' },
    { href: '#/progress', label: 'Progress', id: 'progress' },
  ];

  const soundPacks = [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'soft', label: 'Modern Soft' },
    { id: 'typewriter', label: 'Typewriter' },
    { id: 'piano', label: 'Piano' },
    { id: 'muted', label: 'Muted Beep' },
  ];

  const handleToggleSound = () => {
    soundManager.enabled = !soundManager.enabled;
    soundManager.saveSettings();
    setSoundEnabled(soundManager.enabled);
    if (soundManager.enabled) {
      soundManager.playKeypress('a');
    }
  };

  const handleSelectSoundPack = (packId) => {
    soundManager.soundPack = packId;
    soundManager.enabled = true;
    soundManager.saveSettings();
    setSoundPack(packId);
    setSoundEnabled(true);
    setShowSoundMenu(false);
    soundManager.playKeypress('a');
  };

  const handleDismissWarning = () => {
    setDismissMobileWarning(true);
    try {
      sessionStorage.setItem('pt_dismiss_mobile_warn', 'true');
    } catch (e) {}
  };

  return (
    <>
      {/* Mobile Keyboard Advisory Banner */}
      {!dismissMobileWarning && (
        <div className="md:hidden bg-paper-surface border-b border-paper-border px-4 py-1.5 text-xs text-ink-muted flex items-center justify-between">
          <p className="truncate pr-2">
            Touch typing practice works best with a physical keyboard.
          </p>
          <button
            type="button"
            onClick={handleDismissWarning}
            aria-label="Dismiss keyboard advisory"
            className="text-ink-muted hover:text-ink shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-paper-surface/95 backdrop-blur-md border-b border-paper-border h-16 transition-opacity duration-200">
        <div className="max-w-content mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Logo & Wordmark */}
          <a
            href="#/"
            className="flex items-center gap-2.5 group select-none shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-card bg-accent text-white flex items-center justify-center font-bold text-sm shadow-subtle group-hover:bg-accent-hover transition-colors">
              P
            </div>
            <span className="font-semibold text-ink text-base tracking-tight">
              Pankaj Typing
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-btn text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-paper text-ink font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-paper/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sound Toggle & Menu */}
            <div className="relative">
              <div className="inline-flex rounded-btn border border-paper-border overflow-hidden">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  aria-label={soundEnabled ? 'Key sounds: On. Click to mute.' : 'Key sounds: Off. Click to unmute.'}
                  title={soundEnabled ? `Key sounds: On (${soundPack})` : 'Key sounds: Off'}
                  className="p-2 text-ink hover:bg-paper transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-accent" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-ink-muted" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowSoundMenu(!showSoundMenu)}
                  aria-label="Sound pack menu"
                  title="Choose key sound effect"
                  className="px-1.5 text-ink-muted hover:text-ink hover:bg-paper border-l border-paper-border transition-colors hidden sm:flex items-center"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sound Pack Dropdown */}
              {showSoundMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSoundMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-44 bg-paper-surface border border-paper-border rounded-card shadow-lg p-1.5 z-50 text-xs">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted border-b border-paper-border mb-1">
                      Keyboard Sound
                    </div>
                    {soundPacks.map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => handleSelectSoundPack(pack.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-btn text-left transition-colors ${
                          soundPack === pack.id && soundEnabled
                            ? 'bg-accent-soft text-accent font-medium'
                            : 'text-ink hover:bg-paper'
                        }`}
                      >
                        <span>{pack.label}</span>
                        {soundPack === pack.id && soundEnabled && (
                          <Check className="w-3.5 h-3.5 text-accent" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Settings Link */}
            <a
              href="#/settings"
              aria-label="Open Settings"
              title="Settings"
              className={`p-2 rounded-btn border border-paper-border transition-colors ${
                currentRoute === 'settings'
                  ? 'bg-paper text-ink border-accent'
                  : 'text-ink hover:bg-paper'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-ink-muted" />
            </a>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-btn border border-paper-border text-ink hover:bg-paper transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-ink-muted" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-btn border border-paper-border text-ink hover:bg-paper transition-colors ml-1"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-paper-border bg-paper-surface px-4 py-4 space-y-1 shadow-lg animate-fadeIn">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-btn text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-paper text-ink font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-paper/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            <div className="pt-2 border-t border-paper-border space-y-1">
              <a
                href="#/placement"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-xs text-ink-muted hover:text-ink hover:bg-paper/60"
              >
                Placement Diagnostic
              </a>
              <a
                href="#/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-xs text-ink-muted hover:text-ink hover:bg-paper/60"
              >
                Settings & Preferences
              </a>
              <a
                href="#/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-xs text-ink-muted hover:text-ink hover:bg-paper/60"
              >
                About Pankaj Typing
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
