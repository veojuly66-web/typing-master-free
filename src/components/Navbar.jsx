import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Keyboard, BookOpen, Zap, Gamepad2, Edit3, BarChart2, Volume2, VolumeX, Crown, Settings, Monitor, Download, X, CheckCircle, HardDrive } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [soundPack, setSoundPack] = useState(soundManager.soundPack);
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundManager.enabled);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [showWindowsModal, setShowWindowsModal] = useState(false);

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

          {/* Windows App Download Button */}
          <button
            onClick={() => setShowWindowsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all shadow-sm"
            title="Download or Install on Windows"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Windows App</span>
          </button>

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

      {/* Windows App Download & Install Modal */}
      {showWindowsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowWindowsModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-lg">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Pankaj Typing for Windows</h3>
                <p className="text-xs text-slate-400">Install or download native desktop app for Windows 10 & 11</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 my-4 text-xs">
              {/* Option 1: Native 1-Click App Install (PWA) */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-white text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>Option 1: 1-Click Desktop Install (Recommended)</span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-3">
                  Windows Edge ya Chrome me address bar ke top-right corner me <strong>App Install icon (+)</strong> par click karein. Yeh aapke Windows Desktop aur Taskbar par official app icon bana dega!
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-semibold text-[11px] border border-blue-500/30">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Works 100% Offline on Windows</span>
                </div>
              </div>

              {/* Option 2: Offline Portable ZIP with Batch Launcher */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span>Option 2: Offline Portable ZIP Package</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">90 KB</span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-3">
                  Download karke extract karein aur <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded font-mono">Pankaj-Typing-Windows.bat</code> double click karein. Bina internet ke native window me chalega!
                </p>
                <a
                  href="./pankaj-typing-windows-offline.zip"
                  download="pankaj-typing-windows-offline.zip"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Offline Windows ZIP</span>
                </a>
              </div>

              {/* Option 3: Full Windows .EXE Installer & Portable Executable */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  <span>Option 3: Full Windows .EXE Installer</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Aapke project ke <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded font-mono">release/</code> folder me official Windows Setup Installer (<code className="text-purple-300 font-mono">.exe</code>) aur Portable (<code className="text-purple-300 font-mono">.exe</code>) ready hai.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowWindowsModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
