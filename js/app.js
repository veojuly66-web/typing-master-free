/**
 * Application Bootstrap & Coordinator
 * Manages tab routing, theme switching, lesson list rendering, settings modal,
 * quick navbar controls, zen mode, and summary statistics.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Managers
    window.keyboardVisualizer = new KeyboardVisualizer('virtual-keyboard', 'virtual-hands');
    window.practiceEngine = new PracticeEngine();
    window.speedTestEngine = new SpeedTestEngine();
    window.fallingWordsGame = new FallingWordsGame();
    window.analyticsManager = new AnalyticsManager();
    window.certificateManager = new CertificateManager();

    // 2. Load User Settings & Theme
    applyStoredSettings();

    // 3. Render Lesson Catalog & Summary Stats
    renderLessonCatalog();
    updateSummaryStats();

    // 4. Setup Navigation Tabs
    setupNavigation();

    // 5. Setup Quick Header Controls (Sound, Theme, Zen Mode)
    setupQuickHeaderControls();

    // 6. Setup Settings Modal & Sound Controls
    setupSettingsModal();

    // 7. Global Keyboard Shortcuts (Tab+Enter or Esc to restart)
    setupGlobalShortcuts();

    // 8. Start first lesson by default
    const firstLesson = window.TYPING_COURSES[0].lessons[0];
    window.practiceEngine.startLesson(firstLesson);

    // Profile header
    updateUserHeader();
});

function applyStoredSettings() {
    const settings = window.storageManager.getSettings();

    // Theme
    document.documentElement.setAttribute('data-theme', settings.theme || 'classic');

    // Sound
    window.soundEngine.setSoundType(settings.soundEnabled ? settings.soundType : 'off');
    window.soundEngine.setVolume(settings.soundVolume || 0.5);

    // Sync Dropdowns
    const soundTypeSelect = document.getElementById('setting-sound-type');
    if (soundTypeSelect) soundTypeSelect.value = settings.soundType;

    const quickSoundSelect = document.getElementById('quick-sound-select');
    if (quickSoundSelect) quickSoundSelect.value = settings.soundEnabled ? settings.soundType : 'off';

    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) themeSelect.value = settings.theme;

    const quickThemeSelect = document.getElementById('quick-theme-select');
    if (quickThemeSelect) quickThemeSelect.value = settings.theme;

    // Toggle hands & keyboard
    const handsEl = document.getElementById('virtual-hands');
    if (handsEl) {
        handsEl.style.display = settings.showHands !== false ? 'block' : 'none';
    }
}

function updateUserHeader() {
    const user = window.storageManager.getUser();
    const nameEl = document.getElementById('header-user-name');
    if (nameEl) nameEl.textContent = user.name || 'Typing Champion';

    const avatarEl = document.getElementById('header-user-avatar');
    if (avatarEl) avatarEl.textContent = user.avatar || '🏆';
}

function updateSummaryStats() {
    const progress = window.storageManager.getLessonProgress();
    const scores = progress.scores || {};
    
    let totalCompleted = 0;
    let totalStars = 0;
    let topWpm = 0;

    Object.keys(scores).forEach(id => {
        totalCompleted++;
        totalStars += scores[id].stars || 0;
        if (scores[id].wpm > topWpm) {
            topWpm = scores[id].wpm;
        }
    });

    const progressText = document.getElementById('summary-progress-text');
    if (progressText) progressText.textContent = `${totalCompleted} / 24 Mastered`;

    const progressBar = document.getElementById('summary-progress-bar');
    if (progressBar) {
        const pct = Math.max(4, Math.round((totalCompleted / 24) * 100));
        progressBar.style.width = `${pct}%`;
    }

    const totalStarsEl = document.getElementById('summary-total-stars');
    if (totalStarsEl) totalStarsEl.textContent = `★ ${totalStars}`;

    const topWpmEl = document.getElementById('summary-top-wpm');
    if (topWpmEl) topWpmEl.textContent = `${topWpm} WPM`;
}

function setupQuickHeaderControls() {
    // Quick Theme Switcher
    const quickThemeSelect = document.getElementById('quick-theme-select');
    if (quickThemeSelect) {
        quickThemeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            const settings = window.storageManager.getSettings();
            settings.theme = theme;
            window.storageManager.saveSettings(settings);
            document.documentElement.setAttribute('data-theme', theme);
            const settingTheme = document.getElementById('setting-theme');
            if (settingTheme) settingTheme.value = theme;
        });
    }

    // Quick Sound Switcher
    const quickSoundSelect = document.getElementById('quick-sound-select');
    if (quickSoundSelect) {
        quickSoundSelect.addEventListener('change', (e) => {
            const sound = e.target.value;
            const settings = window.storageManager.getSettings();
            if (sound === 'off') {
                settings.soundEnabled = false;
                window.soundEngine.setSoundType('off');
            } else {
                settings.soundEnabled = true;
                settings.soundType = sound;
                window.soundEngine.setSoundType(sound);
                window.soundEngine.playKeySound();
            }
            window.storageManager.saveSettings(settings);
            const settingSound = document.getElementById('setting-sound-type');
            if (settingSound) settingSound.value = sound;
        });
    }

    // Zen Mode Toggle
    const zenBtn = document.getElementById('btn-zen-mode');
    if (zenBtn) {
        zenBtn.addEventListener('click', () => {
            document.body.classList.toggle('zen-mode');
            const isZen = document.body.classList.contains('zen-mode');
            zenBtn.classList.toggle('bg-sky-600', isZen);
            zenBtn.classList.toggle('text-white', isZen);
        });
    }
}

function setupGlobalShortcuts() {
    let tabPressed = false;

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') tabPressed = true;

        if (e.key === 'Escape' || (tabPressed && e.key === 'Enter')) {
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab && activeTab.id === 'tab-lessons') {
                e.preventDefault();
                if (window.practiceEngine && window.practiceEngine.currentLesson) {
                    window.practiceEngine.startLesson(window.practiceEngine.currentLesson);
                }
            } else if (activeTab && activeTab.id === 'tab-speedtest') {
                e.preventDefault();
                if (window.speedTestEngine) {
                    window.speedTestEngine.resetTest();
                }
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') tabPressed = false;
    });
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            btn.classList.add('active');
            const targetEl = document.getElementById(`tab-${targetTab}`);
            if (targetEl) targetEl.classList.add('active');

            // Tab specific triggers
            if (targetTab === 'speedtest') {
                window.speedTestEngine.resetTest();
            } else if (targetTab === 'analytics') {
                window.analyticsManager.refresh();
            } else if (targetTab === 'games') {
                window.fallingWordsGame.resize();
            }
        });
    });

    // Custom Drill Button in Weak Keys Tab
    const weakDrillBtn = document.getElementById('btn-generate-weak-drill');
    if (weakDrillBtn) {
        weakDrillBtn.addEventListener('click', () => {
            const customDrill = window.analyticsManager.generateCustomWeakDrill();
            if (customDrill) {
                const lessonsNav = document.querySelector('[data-tab="lessons"]');
                if (lessonsNav) lessonsNav.click();
                window.practiceEngine.startLesson(customDrill);
            }
        });
    }
}

function renderLessonCatalog() {
    const catalogContainer = document.getElementById('lesson-catalog-list');
    if (!catalogContainer) return;

    catalogContainer.innerHTML = '';
    const progress = window.storageManager.getLessonProgress();

    window.TYPING_COURSES.forEach((unit, unitIdx) => {
        const unitEl = document.createElement('div');
        unitEl.className = 'unit-accordion mb-3';

        // Count unit progress
        let unitCompletedCount = 0;
        unit.lessons.forEach(l => {
            if (progress.scores[l.id]) unitCompletedCount++;
        });
        const unitPct = Math.round((unitCompletedCount / unit.lessons.length) * 100);

        unitEl.innerHTML = `
            <div class="unit-header flex items-center justify-between p-3 bg-slate-950/70 rounded-xl cursor-pointer hover:bg-slate-800/80 border border-white/10 transition-colors">
                <div class="flex items-center gap-2">
                    <span class="badge badge-accent">${unit.badge}</span>
                    <h3 class="font-bold text-xs text-slate-100">${unit.title}</h3>
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-[10px] text-slate-400 font-mono">${unitPct}%</span>
                    <span class="text-slate-400">▾</span>
                </div>
            </div>
            <div class="unit-body mt-1.5 space-y-1 pl-1">
                ${unit.lessons.map(lesson => {
                    const isCompleted = progress.scores[lesson.id];
                    const stars = isCompleted ? progress.scores[lesson.id].stars : 0;
                    const wpm = isCompleted ? progress.scores[lesson.id].wpm : 0;
                    const isUnlocked = progress.completedIds.includes(lesson.id);

                    return `
                        <div class="lesson-item flex items-center justify-between p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                            isCompleted ? 'bg-slate-900/60 border-emerald-900/40 hover:border-emerald-600' :
                            isUnlocked ? 'bg-slate-900/30 border-white/5 hover:border-sky-500/50 hover:bg-slate-800/60' :
                            'bg-slate-950/40 border-transparent opacity-60'
                        }" data-lesson-id="${lesson.id}">
                            <div class="flex items-center gap-2">
                                <span class="status-icon text-xs">${isCompleted ? '✅' : (isUnlocked ? '▶' : '🔒')}</span>
                                <span class="font-medium ${isCompleted ? 'text-slate-200' : 'text-slate-300'}">${lesson.title}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs">
                                ${isCompleted ? `<span class="text-amber-400 font-mono">${'★'.repeat(stars)}</span> <span class="font-mono text-slate-400">${wpm} WPM</span>` : `<span class="text-slate-500 text-[10px]">Goal: ${lesson.targetWpm}</span>`}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        unitEl.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', () => {
                const lessonId = item.dataset.lessonId;
                const found = window.getLessonById(lessonId);
                if (found) {
                    window.practiceEngine.startLesson(found.lesson);
                    document.querySelectorAll('.lesson-item').forEach(li => li.classList.remove('active-playing'));
                    item.classList.add('active-playing');

                    const unitBadge = document.getElementById('lesson-unit-badge');
                    if (unitBadge) unitBadge.textContent = found.unit.badge;
                }
            });
        });

        catalogContainer.appendChild(unitEl);
    });
}

function setupSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('btn-open-settings');
    const closeBtn = document.getElementById('btn-close-settings');

    if (openBtn) openBtn.onclick = () => modal.classList.add('open');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('open');

    // Theme Selector
    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            const settings = window.storageManager.getSettings();
            settings.theme = e.target.value;
            window.storageManager.saveSettings(settings);
            document.documentElement.setAttribute('data-theme', settings.theme);
            const quickTheme = document.getElementById('quick-theme-select');
            if (quickTheme) quickTheme.value = settings.theme;
        });
    }

    // Sound Selector
    const soundSelect = document.getElementById('setting-sound-type');
    if (soundSelect) {
        soundSelect.addEventListener('change', (e) => {
            const settings = window.storageManager.getSettings();
            settings.soundType = e.target.value;
            window.storageManager.saveSettings(settings);
            window.soundEngine.setSoundType(settings.soundType);
            window.soundEngine.playKeySound();
            const quickSound = document.getElementById('quick-sound-select');
            if (quickSound) quickSound.value = settings.soundType;
        });
    }

    // Hands toggle
    const handsToggle = document.getElementById('setting-toggle-hands');
    if (handsToggle) {
        const settings = window.storageManager.getSettings();
        handsToggle.checked = settings.showHands !== false;
        handsToggle.addEventListener('change', (e) => {
            settings.showHands = e.target.checked;
            window.storageManager.saveSettings(settings);
            const handsEl = document.getElementById('virtual-hands');
            if (handsEl) handsEl.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    // Sound toggle
    const soundToggle = document.getElementById('setting-toggle-sound');
    if (soundToggle) {
        const settings = window.storageManager.getSettings();
        soundToggle.checked = settings.soundEnabled !== false;
        soundToggle.addEventListener('change', (e) => {
            settings.soundEnabled = e.target.checked;
            window.storageManager.saveSettings(settings);
            window.soundEngine.muted = !e.target.checked;
            if (e.target.checked) window.soundEngine.playKeySound();
        });
    }

    // Export Data Button
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn) {
        exportBtn.onclick = () => {
            const json = window.storageManager.exportData();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `typing_master_backup_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
        };
    }

    // Import Data
    const importInput = document.getElementById('import-file-input');
    if (importInput) {
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const ok = window.storageManager.importData(evt.target.result);
                if (ok) {
                    alert('Progress successfully restored! Reloading...');
                    window.location.reload();
                } else {
                    alert('Invalid backup file. Could not import data.');
                }
            };
            reader.readAsText(file);
        });
    }

    // Reset Data Button
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (confirm('Are you sure you want to reset all your progress, test records, and scores?')) {
                window.storageManager.resetAllData();
                window.location.reload();
            }
        };
    }
}
