import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Keyboard, BookOpen, Zap, Gamepad2, Edit3, BarChart2, Volume2, VolumeX, Crown, Settings } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [soundPack, setSoundPack] = useState(soundManager.soundPack);
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundManager.enabled);
  const [showSoundSettings, setShowSoundSettings] = useState(false);

  const navItems = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'tests', label: 'Speed Tests', icon: Zap },
    { id: 'games', label: 'Arcade Games', icon: Gamepad2 },
    { id: 'custom', label: 'Custom Text', icon: Edit3 },
    { id: 'stats', label: 'Dashboard', icon: BarChart2 },
  ];

  const handleToggleSound = () => {
    soundManager.enabled = !soundManager.enabled;
    soundManager.saveSettings();
    setIsSoundEnabled(soundManager.enabled);
  };

  const handleChangeSoundPack = (pack) => {
    soundManager.soundPack = pack;
    soundManager.saveSettings();
    setSoundPack(pack);
    soundManager.playKeypress('a');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('courses')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">
                Pankaj<span className="text-blue-400">Typing</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                PRO 100% FREE
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Touch Typing Professional Academy</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Settings & Sound */}
        <div className="flex items-center gap-2 relative">
          {/* Sound Profile Button */}
          <div className="relative">
            <button
              onClick={() => setShowSoundSettings(!showSoundSettings)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Typing Sound Settings"
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span className="hidden sm:inline text-slate-400 capitalize">{soundPack}</span>
            </button>

            {/* Sound Dropdown Popover */}
            {showSoundSettings && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-white">Audio Settings</span>
                  <button
                    onClick={handleToggleSound}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isSoundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {isSoundEnabled ? 'Audio ON' : 'Audio OFF'}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 mb-2 font-medium">Switch Keyboard Sound:</div>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'piano', label: 'Grand Piano (Musical)' },
                    { id: 'mechanical', label: 'Mechanical Switch (Thock)' },
                    { id: 'typewriter', label: 'Vintage Typewriter' },
                    { id: 'soft', label: 'Soft Gentle Click' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleChangeSoundPack(p.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-colors ${
                        soundPack === p.id 
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Premium Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">PRO Unlocked</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
