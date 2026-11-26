import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import { Volume2, VolumeX, Sun, Moon, Menu, X, Monitor, Sliders } from 'lucide-react';

export default function Navbar({ currentRoute, isDark, onToggleTheme }) {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.enabled);
  const [soundPack, setSoundPack] = useState(soundManager.soundPack);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWindowsModal, setShowWindowsModal] = useState(false);

  const navItems = [
    { href: '#/lessons', label: 'Lessons', id: 'lessons' },
    { href: '#/test', label: 'Speed Test', id: 'test' },
    { href: '#/games', label: 'Games', id: 'games' },
    { href: '#/practice', label: 'Practice', id: 'practice' },
    { href: '#/progress', label: 'Progress', id: 'progress' },
  ];

  const handleToggleSound = () => {
    soundManager.enabled = !soundManager.enabled;
    soundManager.saveSettings();
    setSoundEnabled(soundManager.enabled);
  };

  const handleSelectSoundPack = (pack) => {
    soundManager.soundPack = pack;
    soundManager.enabled = true;
    soundManager.saveSettings();
    setSoundPack(pack);
    setSoundEnabled(true);
    soundManager.playKeypress('a');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper-surface/95 backdrop-blur-md border-b border-paper-border h-16">
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
            {/* Sound Toggle & Sound Pack Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleSound}
                aria-label={soundEnabled ? 'Key sounds: On. Click to mute.' : 'Key sounds: Off. Click to unmute.'}
                title={soundEnabled ? `Key sounds: On (${soundPack})` : 'Key sounds: Off'}
                className="p-2 rounded-btn border border-paper-border text-ink hover:bg-paper transition-colors"
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
                aria-label="Sound options"
                title="Select keyboard sound effect"
                className="hidden sm:inline-flex p-1.5 text-ink-muted hover:text-ink text-xs transition-colors align-middle"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              {/* Sound Options Popover */}
              {showSoundMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-paper-surface border border-paper-border rounded-card p-2 shadow-lg z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-paper-border font-medium text-ink">
                    <span>Key Sound Pack</span>
                    <button
                      onClick={() => setShowSoundMenu(false)}
                      className="text-ink-muted hover:text-ink"
                      aria-label="Close sound menu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'piano', label: 'Grand Piano (Melodic)' },
                      { id: 'mechanical', label: 'Mechanical Switch' },
                      { id: 'typewriter', label: 'Vintage Typewriter' },
                      { id: 'soft', label: 'Soft Gentle Click' }
                    ].map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => {
                          handleSelectSoundPack(pack.id);
                          setShowSoundMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-btn font-medium transition-colors ${
                          soundPack === pack.id && soundEnabled
                            ? 'bg-accent-soft text-accent'
                            : 'text-ink-muted hover:text-ink hover:bg-paper'
                        }`}
                      >
                        {pack.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-btn border border-paper-border text-ink hover:bg-paper transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-ink-muted" />}
            </button>

            {/* Quiet Windows App Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowWindowsModal(true)}
              aria-label="Download Windows offline application"
              title="Use offline on Windows"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border text-xs text-ink-muted hover:text-ink hover:bg-paper transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Windows</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 rounded-btn border border-paper-border text-ink hover:bg-paper transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-paper-surface border-b border-paper-border px-4 py-3 shadow-lg animate-fadeIn">
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {navItems.map((item) => {
                const isActive = currentRoute === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-btn text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-paper text-accent font-semibold'
                        : 'text-ink-muted hover:text-ink hover:bg-paper'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}

              <div className="pt-2 mt-2 border-t border-paper-border flex flex-col space-y-1 text-xs text-ink-muted">
                <a
                  href="#/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 hover:text-ink"
                >
                  About Pankaj Typing
                </a>
                <a
                  href="#/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 hover:text-ink"
                >
                  Privacy Policy
                </a>
                <a
                  href="#/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 hover:text-ink"
                >
                  Contact
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowWindowsModal(true);
                  }}
                  className="text-left px-3 py-1.5 hover:text-ink flex items-center gap-1.5"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Download for Windows</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Windows App Modal */}
      {showWindowsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-paper-surface border border-paper-border rounded-card max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowWindowsModal(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-ink-muted hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-card bg-accent-soft text-accent flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink">Windows Offline Edition</h3>
                <p className="text-xs text-ink-muted">Practice typing without internet</p>
              </div>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              You can run Pankaj Typing as a standalone desktop application on Windows 10 & 11 or install it as a lightweight Progressive Web App (PWA).
            </p>

            <div className="space-y-3">
              <a
                href="./pankaj-typing-windows-offline.zip"
                download="pankaj-typing-windows-offline.zip"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors"
              >
                <span>Download Offline ZIP package</span>
              </a>

              <a
                href="./Pankaj-Typing-Windows.bat"
                download="Pankaj-Typing-Windows.bat"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn bg-paper hover:bg-paper-border/40 text-ink border border-paper-border text-xs font-medium transition-colors"
              >
                <span>Download Windows Quick-Launch script (.bat)</span>
              </a>
            </div>

            <p className="text-[11px] text-ink-muted mt-4 text-center">
              Or in Google Chrome/Edge, click the install icon in the address bar to install as an app.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
