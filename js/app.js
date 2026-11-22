/**
 * Application Bootstrap & Coordinator
 * Manages tab routing, theme switching, lesson list rendering, settings modal, and init.
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

    // 3. Render Lesson Catalog
    renderLessonCatalog();

    // 4. Setup Navigation Tabs
    setupNavigation();

    // 5. Setup Settings Modal & Sound Controls
    setupSettingsModal();

    // 6. Start first lesson by default
    const progress = window.storageManager.getLessonProgress();
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

    // Audio select dropdowns
    const soundTypeSelect = document.getElementById('setting-sound-type');
    if (soundTypeSelect) soundTypeSelect.value = settings.soundType;

    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) themeSelect.value = settings.theme;

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
                // Switch to lessons tab
                const lessonsNav = document.querySelector('[data-tab="lessons"]');
                if (lessonsNav) lessonsNav.click();

                // Load custom drill
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

    window.TYPING_COURSES.forEach(unit => {
        const unitEl = document.createElement('div');
        unitEl.className = 'unit-accordion mb-4';

        unitEl.innerHTML = `
            <div class="unit-header flex items-center justify-between p-3 bg-slate-900/80 rounded-xl cursor-pointer hover:bg-slate-800/80 border border-slate-800 transition-colors">
                <div class="flex items-center gap-2">
                    <span class="badge badge-accent">${unit.badge}</span>
                    <h3 class="font-bold text-sm text-slate-100">${unit.title}</h3>
                </div>
                <div class="text-xs text-slate-400">
                    ${unit.lessons.length} lessons ▾
                </div>
            </div>
            <div class="unit-body mt-2 space-y-1.5 pl-2">
                ${unit.lessons.map(lesson => {
                    const isCompleted = progress.scores[lesson.id];
                    const stars = isCompleted ? progress.scores[lesson.id].stars : 0;
                    const wpm = isCompleted ? progress.scores[lesson.id].wpm : 0;
                    const isUnlocked = progress.completedIds.includes(lesson.id);

                    return `
                        <div class="lesson-item flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all cursor-pointer ${
                            isCompleted ? 'bg-slate-900/60 border-emerald-900/50 hover:border-emerald-700' :
                            isUnlocked ? 'bg-slate-900/40 border-slate-800 hover:border-sky-700 hover:bg-slate-800/50' :
                            'bg-slate-950/40 border-slate-900 opacity-60'
                        }" data-lesson-id="${lesson.id}">
                            <div class="flex items-center gap-2">
                                <span class="status-icon text-xs">${isCompleted ? '✅' : (isUnlocked ? '▶' : '🔒')}</span>
                                <span class="font-medium ${isCompleted ? 'text-slate-200' : 'text-slate-300'}">${lesson.title}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs">
                                ${isCompleted ? `<span class="text-amber-400">${'★'.repeat(stars)}</span> <span class="font-mono text-slate-400">${wpm} WPM</span>` : `<span class="text-slate-500">Goal: ${lesson.targetWpm} WPM</span>`}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Bind clicks
        unitEl.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', () => {
                const lessonId = item.dataset.lessonId;
                const found = window.getLessonById(lessonId);
                if (found) {
                    window.practiceEngine.startLesson(found.lesson);

                    // Highlight active lesson in sidebar
                    document.querySelectorAll('.lesson-item').forEach(li => li.classList.remove('active-playing'));
                    item.classList.add('active-playing');
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
                    alert('Progress successfully imported! Reloading...');
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
