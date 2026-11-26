import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../i18n';
import { BRAND } from '../config/brand';
import { PlanBadge } from './ui';
import { Volume2, VolumeX, Sun, Moon, Menu, X, User, Sliders, Check, Globe } from 'lucide-react';

export default function Navbar({ currentRoute, isDark, onToggleTheme }) {
  const { user, isProUser, trialDaysLeft } = useAuth();
  const { language, setLanguage, t } = useTranslation();

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
    { href: '#/lessons', label: t('nav.courses'), id: 'lessons' },
    { href: '#/exams', label: t('nav.exams'), id: 'exams' },
    { href: '#/test', label: t('nav.speedTest'), id: 'test' },
    { href: '#/practice', label: t('nav.practice'), id: 'practice' },
    { href: '#/progress', label: t('nav.progress'), id: 'progress' },
    { href: '#/pricing', label: t('nav.pricing'), id: 'pricing' },
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

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      {!dismissMobileWarning && (
        <div className="md:hidden bg-surface-2 border-b border-border px-4 py-1.5 text-xs text-text-muted flex items-center justify-between">
          <p className="truncate pr-2">
            Touch typing practice works best with a physical keyboard.
          </p>
          <button
            type="button"
            onClick={handleDismissWarning}
            aria-label="Dismiss keyboard advisory"
            className="text-text-muted hover:text-text shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-surface border-b border-border h-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
          {/* Logo & Wordmark */}
          <a
            href="#/"
            className="flex items-center gap-2.5 group select-none shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="keycap w-8 h-8 text-accent font-medium text-sm group-hover:border-accent transition-colors">
              P
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-text text-sm sm:text-base tracking-tight leading-none">
                {BRAND.name}
              </span>
              <span className="text-[11px] text-text-muted hidden sm:inline leading-none mt-1">
                English &amp; Hindi tutor
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3 h-8 inline-flex items-center rounded-btn text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-2 text-text'
                      : 'text-text-muted hover:text-text hover:bg-surface-2/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Switch Language (English / Hindi)"
              title="Switch Language"
              className="px-2.5 h-8 rounded-btn border border-border text-xs text-text hover:bg-surface-2 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <div className="relative">
              <div className="inline-flex rounded-btn border border-border overflow-hidden h-8">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  aria-label={soundEnabled ? 'Key sounds: On. Click to mute.' : 'Key sounds: Off. Click to unmute.'}
                  title={soundEnabled ? `Key sounds: On (${soundPack})` : 'Key sounds: Off'}
                  className="px-2 text-text hover:bg-surface-2 transition-colors inline-flex items-center"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  ) : (
                    <VolumeX className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowSoundMenu(!showSoundMenu)}
                  aria-label="Sound pack menu"
                  title="Choose key sound effect"
                  className="px-1.5 text-text-muted hover:text-text hover:bg-surface-2 border-l border-border transition-colors hidden sm:flex items-center"
                >
                  <Sliders className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>

              {showSoundMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSoundMenu(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 bg-surface border border-border rounded-card shadow-modal p-1.5 z-50 text-xs">
                    <div className="px-2 py-1.5 text-xs font-medium text-text-muted border-b border-border mb-1">
                      Keyboard sound
                    </div>
                    {soundPacks.map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => handleSelectSoundPack(pack.id)}
                        className={`w-full flex items-center justify-between px-2.5 h-8 rounded-[5px] text-left transition-colors ${
                          soundPack === pack.id && soundEnabled
                            ? 'bg-accent-soft text-accent font-medium'
                            : 'text-text hover:bg-surface-2'
                        }`}
                      >
                        <span>{pack.label}</span>
                        {soundPack === pack.id && soundEnabled && (
                          <Check className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="w-8 h-8 inline-flex items-center justify-center rounded-btn border border-border text-text hover:bg-surface-2 transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
              )}
            </button>

            {user ? (
              <a
                href="#/account"
                className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-btn border border-border text-xs text-text hover:bg-surface-2 transition-colors"
                title={user.email}
              >
                <User className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
                <PlanBadge plan={isProUser ? 'pro' : 'trial'} trialDaysLeft={trialDaysLeft} />
              </a>
            ) : (
              <a
                href="#/login"
                className="hidden sm:inline-flex items-center px-3 h-8 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium shadow-subtle transition-colors"
              >
                {t('nav.login')}
              </a>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-8 h-8 inline-flex items-center justify-center rounded-btn border border-border text-text hover:bg-surface-2 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" strokeWidth={1.5} /> : <Menu className="w-4 h-4" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-surface px-4 py-4 space-y-1 shadow-modal">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center h-9 px-3 rounded-btn text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-2 text-text'
                      : 'text-text-muted hover:text-text hover:bg-surface-2/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            <div className="pt-3 border-t border-border space-y-1 text-xs">
              {!user ? (
                <a
                  href="#/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center h-9 px-3 rounded-btn font-medium text-accent hover:bg-surface-2"
                >
                  {t('nav.login')} / {t('nav.startFree')}
                </a>
              ) : (
                <a
                  href="#/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center h-9 px-3 rounded-btn text-text hover:bg-surface-2"
                >
                  {t('nav.account')}
                </a>
              )}
              {user?.email === BRAND.adminEmail && (
                <a
                  href="#/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center h-9 px-3 rounded-btn text-pro font-medium hover:bg-surface-2"
                >
                  {t('nav.admin')}
                </a>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
