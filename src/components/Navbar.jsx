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
      {/* Mobile Keyboard Advisory Banner */}
      {!dismissMobileWarning && (
        <div className="md:hidden bg-surface border-b border-border px-4 py-1.5 text-2xs text-text-muted flex items-center justify-between">
          <p className="truncate pr-2">
            Touch typing practice works best with a physical hardware keyboard.
          </p>
          <button
            type="button"
            onClick={handleDismissWarning}
            aria-label="Dismiss keyboard advisory"
            className="text-text-muted hover:text-text shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border h-16 transition-opacity duration-200">
        <div className="max-w-content mx-auto px-4 h-full flex items-center justify-between gap-3">
          {/* Logo & Wordmark */}
          <a
            href="#/"
            className="flex items-center gap-2.5 group select-none shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-card bg-accent text-white flex items-center justify-center font-bold text-sm shadow-subtle group-hover:bg-accent-hover transition-colors">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-text text-sm sm:text-base tracking-tight leading-none">
                {BRAND.name}
              </span>
              <span className="text-[10px] text-text-muted hidden sm:inline leading-none mt-0.5">
                English & Hindi SaaS
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
                  className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-2 text-text font-semibold'
                      : 'text-text-muted hover:text-text hover:bg-surface-2/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Switch Language (English / Hindi)"
              title="Switch Language"
              className="px-2.5 py-1 rounded-btn border border-border text-xs text-text hover:bg-surface-2 font-medium flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-accent" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Sound Toggle & Menu */}
            <div className="relative">
              <div className="inline-flex rounded-btn border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  aria-label={soundEnabled ? 'Key sounds: On. Click to mute.' : 'Key sounds: Off. Click to unmute.'}
                  title={soundEnabled ? `Key sounds: On (${soundPack})` : 'Key sounds: Off'}
                  className="p-1.5 sm:p-2 text-text hover:bg-surface-2 transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-accent" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-text-muted" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowSoundMenu(!showSoundMenu)}
                  aria-label="Sound pack menu"
                  title="Choose key sound effect"
                  className="px-1 text-text-muted hover:text-text hover:bg-surface-2 border-l border-border transition-colors hidden sm:flex items-center"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sound Pack Dropdown */}
              {showSoundMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSoundMenu(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 bg-surface border border-border rounded-card shadow-lg p-1.5 z-50 text-xs">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted border-b border-border mb-1">
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
                            : 'text-text hover:bg-surface-2'
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

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-btn border border-border text-text hover:bg-surface-2 transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-text-muted" />
              )}
            </button>

            {/* Auth / Account Buttons */}
            {user ? (
              <a
                href="#/account"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn border border-border text-xs text-text hover:bg-surface-2"
                title={user.email}
              >
                <User className="w-3.5 h-3.5 text-text-muted" />
                <PlanBadge plan={isProUser ? 'pro' : 'trial'} trialDaysLeft={trialDaysLeft} />
              </a>
            ) : (
              <a
                href="#/login"
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-subtle transition-colors"
              >
                {t('nav.login')}
              </a>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-btn border border-border text-text hover:bg-surface-2 transition-colors ml-1"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Sheet */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-surface px-4 py-4 space-y-1 shadow-lg animate-fadeIn">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-btn text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-2 text-text font-semibold'
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
                  className="block px-3 py-2 rounded-btn font-semibold text-accent"
                >
                  {t('nav.login')} / {t('nav.startFree')}
                </a>
              ) : (
                <a
                  href="#/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-btn text-text"
                >
                  {t('nav.account')}
                </a>
              )}
              {user?.email === BRAND.adminEmail && (
                <a
                  href="#/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-btn text-amber-600 font-semibold"
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
