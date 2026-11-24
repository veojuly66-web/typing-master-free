// Hindi Typing Master Pro - Main Application Controller
import { INSCRIPT_LAYOUT, REMINGTON_LAYOUT, FINGER_COLORS, FINGER_NAMES, buildLookupMap } from './keyboard-layouts.js';
import { LESSON_MODULES, TYPING_TESTS, GAME_WORDS } from './lessons-data.js';
import { sound } from './sound-effects.js';

// Polyfill for Canvas roundRect for older browser engines
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    const [tl, tr, br, bl] = radii;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

class HindiTypingApp {
  constructor() {
    this.layouts = {
      inscript: { config: INSCRIPT_LAYOUT, ...buildLookupMap(INSCRIPT_LAYOUT) },
      remington: { config: REMINGTON_LAYOUT, ...buildLookupMap(REMINGTON_LAYOUT) }
    };

    // App State
    this.currentLayoutId = localStorage.getItem('htm_layout') || 'inscript';
    this.inputMode = localStorage.getItem('htm_input_mode') || 'emulate'; // 'emulate' or 'ime'
    this.theme = localStorage.getItem('htm_theme') || 'dark';
    this.activeTab = 'lessons';

    // Typing Engine State
    this.currentLesson = null;
    this.textChars = [];
    this.currentIndex = 0;
    this.correctCount = 0;
    this.errorCount = 0;
    this.totalKeystrokes = 0;
    this.isStarted = false;
    this.startTime = null;
    this.timerInterval = null;
    this.timeLimit = 0; // 0 = unlimited / lesson mode
    this.remainingSeconds = 0;

    // Progress State (saved in localStorage)
    this.completedLessons = JSON.parse(localStorage.getItem('htm_completed') || '[]');
    this.testHistory = JSON.parse(localStorage.getItem('htm_history') || '[]');

    // Game State
    this.gameRunning = false;
    this.gameScore = 0;
    this.gameLives = 5;
    this.gameWords = [];
    this.gameAnimId = null;
    this.gameCurrentInput = '';

    this.init();
  }

  get currentLayout() {
    return this.layouts[this.currentLayoutId];
  }

  init() {
    // Apply theme
    document.documentElement.setAttribute('data-theme', this.theme);

    // Setup UI components
    this.renderSidebarLessons();
    this.renderKeyboard();
    this.setupEventListeners();
    this.updateLayoutBadge();

    // Load first lesson by default
    const firstLesson = LESSON_MODULES[0].lessons[0];
    this.loadLesson(firstLesson, 'lesson');

    // Keep hidden input focused for hardware keyboard events
    this.focusInput();
  }

  focusInput() {
    const input = document.getElementById('hiddenInput');
    if (input) {
      input.focus();
    }
  }

  setupEventListeners() {
    // Keep focus active when clicking anywhere in typing arena
    const displayCard = document.querySelector('.display-card');
    if (displayCard) {
      displayCard.addEventListener('click', () => this.focusInput());
    }

    // Tab Navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // Layout Selector
    const layoutSelect = document.getElementById('layoutSelect');
    if (layoutSelect) {
      layoutSelect.value = this.currentLayoutId;
      layoutSelect.addEventListener('change', (e) => {
        this.currentLayoutId = e.target.value;
        localStorage.setItem('htm_layout', this.currentLayoutId);
        this.renderKeyboard();
        this.updateLayoutBadge();
        this.updateTargetHighlight();
      });
    }

    // Input Mode Selector (Emulate vs Native IME)
    const inputModeSelect = document.getElementById('inputModeSelect');
    if (inputModeSelect) {
      inputModeSelect.value = this.inputMode;
      inputModeSelect.addEventListener('change', (e) => {
        this.inputMode = e.target.value;
        localStorage.setItem('htm_input_mode', this.inputMode);
      });
    }

    // Audio & Theme Toggles
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isEnabled = sound.toggle();
        soundBtn.innerHTML = isEnabled ? '🔊' : '🔇';
        soundBtn.title = isEnabled ? 'आवाज़ चालू (Sound On)' : 'आवाज़ बंद (Mute)';
      });
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('htm_theme', this.theme);
        themeBtn.innerHTML = this.theme === 'dark' ? '🌙' : '☀️';
      });
    }

    // Typing Input Handler (Dual Mode: Physical Hardware Emulation + Native IME)
    const hiddenInput = document.getElementById('hiddenInput');
    if (hiddenInput) {
      // Keydown for physical key mapping and special keys
      window.addEventListener('keydown', (e) => {
        // Ignore shortcuts like Ctrl+C, Ctrl+V, F12
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        // If inside custom textarea or certificate input, ignore
        if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.target.id !== 'hiddenInput')) {
          return;
        }

        // On-screen key press visual feedback
        this.highlightPressedKey(e.code, true);

        if (e.key === 'Escape') {
          e.preventDefault();
          this.resetLesson();
          return;
        }

        if (e.key === 'Backspace') {
          e.preventDefault();
          this.handleBackspace();
          return;
        }

        if (e.key === 'Tab') {
          e.preventDefault();
          return;
        }

        // If in Emulation Mode: Map physical QWERTY key code directly to Hindi char
        if (this.inputMode === 'emulate') {
          const mapping = this.currentLayout.codeToChar[e.code];
          if (mapping) {
            e.preventDefault();
            const charToType = e.shiftKey ? mapping.shift : mapping.normal;
            if (charToType && charToType.length > 0) {
              this.handleCharacterInput(charToType);
            }
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        this.highlightPressedKey(e.code, false);
      });

      // If in Native IME mode, capture input events
      hiddenInput.addEventListener('input', (e) => {
        if (this.inputMode === 'ime') {
          const val = hiddenInput.value;
          if (val.length > 0) {
            const char = val[val.length - 1];
            this.handleCharacterInput(char);
            hiddenInput.value = '';
          }
        }
      });
    }

    // Custom Practice Submit
    const startCustomBtn = document.getElementById('startCustomBtn');
    if (startCustomBtn) {
      startCustomBtn.addEventListener('click', () => {
        const text = document.getElementById('customText').value.trim();
        if (text) {
          this.loadLesson({
            id: 'custom-' + Date.now(),
            title: 'कस्टम अभ्यास (Custom Practice)',
            type: 'custom',
            text: text
          }, 'custom');
          this.switchTab('lessons');
        }
      });
    }

    document.getElementById('quickRestartBtn')?.addEventListener('click', () => {
      this.resetLesson();
      this.focusInput();
    });
    document.getElementById('retryBtn')?.addEventListener('click', () => {
      this.closeModal();
      this.resetLesson();
    });

    document.getElementById('nextLessonBtn')?.addEventListener('click', () => {
      this.closeModal();
      this.loadNextLesson();
    });

    document.getElementById('getCertBtn')?.addEventListener('click', () => {
      this.closeModal();
      this.openCertificateModal();
    });

    document.getElementById('closeCertBtn')?.addEventListener('click', () => {
      document.getElementById('certModal').classList.remove('active');
    });

    document.getElementById('downloadCertBtn')?.addEventListener('click', () => {
      this.downloadCertificate();
    });

    document.getElementById('studentNameInput')?.addEventListener('input', () => {
      this.renderCertificate();
    });

    // Word Rain Game Controls
    document.getElementById('startGameBtn')?.addEventListener('click', () => {
      this.startWordRainGame();
    });
  }

  updateLayoutBadge() {
    const badge = document.getElementById('currentLayoutBadge');
    if (badge) {
      badge.textContent = this.currentLayout.config.name;
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });

    // Toggle views
    const mainArena = document.getElementById('mainArenaView');
    const gameView = document.getElementById('gameView');
    const customView = document.getElementById('customPracticeView');
    const testListView = document.getElementById('testListView');

    if (mainArena) mainArena.style.display = (tabId === 'lessons') ? 'grid' : 'none';
    if (gameView) gameView.classList.toggle('active', tabId === 'game');
    if (customView) customView.classList.toggle('active', tabId === 'custom');
    if (testListView) testListView.style.display = (tabId === 'tests') ? 'block' : 'none';

    if (tabId === 'tests') {
      this.renderTestList();
    } else if (tabId === 'certificate') {
      this.openCertificateModal();
    } else if (tabId === 'lessons') {
      this.focusInput();
    }
  }

  renderSidebarLessons() {
    const container = document.getElementById('modulesContainer');
    if (!container) return;

    let html = '';
    LESSON_MODULES.forEach((mod, modIdx) => {
      const isCompleted = mod.lessons.every(l => this.completedLessons.includes(l.id));
      html += `
        <div class="module-group">
          <div class="module-header">
            <span>${mod.title}</span>
            <span style="font-size:0.75rem; color:${isCompleted ? '#10b981' : 'var(--text-dim)'}">
              ${isCompleted ? 'पूर्ण ✓' : mod.badge.split(' ')[0]}
            </span>
          </div>
          <div class="module-lessons">
            ${mod.lessons.map(lesson => {
              const done = this.completedLessons.includes(lesson.id);
              const isActive = this.currentLesson && this.currentLesson.id === lesson.id;
              return `
                <div class="lesson-item ${isActive ? 'active' : ''} ${done ? 'completed' : ''}" 
                     data-lesson-id="${lesson.id}">
                  <span>${lesson.title}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach click listeners to lesson items
    container.querySelectorAll('.lesson-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.lessonId;
        const found = this.findLessonById(id);
        if (found) {
          this.loadLesson(found, 'lesson');
          this.switchTab('lessons');
        }
      });
    });

    this.updateProgressFill();
  }

  renderTestList() {
    const listContainer = document.getElementById('testsContainer');
    if (!listContainer) return;

    let html = `
      <div style="background:var(--bg-card); padding:1.5rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          ⏱️ आधिकारिक हिंदी टाइपिंग टेस्ट (Official Hindi Speed Tests)
        </h2>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">
          अपनी वास्तविक टाइपिंग गति और शुद्धता मापें। SSC CGL, CHSL, High Court, UPSSSC एवं पुलिस भर्ती परीक्षाओं के वास्तविक पैटर्न पर आधारित।
        </p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
    `;

    TYPING_TESTS.forEach(test => {
      const bestHistory = this.testHistory.filter(h => h.id === test.id);
      const bestWpm = bestHistory.length > 0 ? Math.max(...bestHistory.map(h => h.wpm)) : null;

      html += `
        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; gap:1rem;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
              <span style="background:rgba(99,102,241,0.2); color:#818cf8; padding:2px 8px; border-radius:999px; font-size:0.75rem; font-weight:600;">
                ${test.category}
              </span>
              <span style="color:#f59e0b; font-size:0.8rem; font-weight:700;">
                ${test.duration / 60} मिनट
              </span>
            </div>
            <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:0.4rem;">${test.title}</h3>
            <p style="font-size:0.8rem; color:var(--text-muted);">${test.text.substring(0, 95)}...</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.75rem;">
            <span style="font-size:0.8rem; color:${bestWpm ? '#10b981' : 'var(--text-dim)'}; font-weight:600;">
              ${bestWpm ? `सर्वश्रेष्ठ: ${bestWpm} WPM` : 'अभी तक नहीं दिया'}
            </span>
            <button class="primary-btn" style="padding:0.4rem 1rem; font-size:0.85rem;" data-test-id="${test.id}">
              टेस्ट शुरू करें →
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    listContainer.innerHTML = html;

    listContainer.querySelectorAll('[data-test-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.testId;
        const test = TYPING_TESTS.find(t => t.id === id);
        if (test) {
          this.loadLesson(test, 'test');
          this.switchTab('lessons');
        }
      });
    });
  }

  updateProgressFill() {
    const totalLessons = LESSON_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedCount = this.completedLessons.length;
    const pct = Math.min(100, Math.round((completedCount / totalLessons) * 100));

    const fill = document.getElementById('courseProgressFill');
    const text = document.getElementById('courseProgressText');
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `${pct}% पूर्ण (${completedCount}/${totalLessons})`;
  }

  findLessonById(id) {
    for (const mod of LESSON_MODULES) {
      const l = mod.lessons.find(item => item.id === id);
      if (l) return l;
    }
    return null;
  }

  loadLesson(lesson, mode = 'lesson') {
    this.currentLesson = lesson;
    this.lessonMode = mode; // 'lesson', 'test', 'custom'

    // Timer setup
    if (mode === 'test' && lesson.duration) {
      this.timeLimit = lesson.duration;
      this.remainingSeconds = lesson.duration;
    } else {
      this.timeLimit = 0;
      this.remainingSeconds = 0;
    }

    // Reset Engine State
    this.currentIndex = 0;
    this.correctCount = 0;
    this.errorCount = 0;
    this.totalKeystrokes = 0;
    this.isStarted = false;
    this.startTime = null;
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Prepare text characters (preserving spaces)
    this.textChars = lesson.text.split('');

    // Update Meta display
    document.getElementById('lessonTitle').textContent = lesson.title;
    document.getElementById('lessonBadge').textContent = 
      mode === 'test' ? `टाइपिंग परीक्षा (${lesson.duration / 60} मिनट)` : (lesson.type || 'पाठ्यक्रम');

    // Render Text in display
    this.renderTextDisplay();
    this.updateStatsDisplay();
    this.updateTargetHighlight();
    this.renderSidebarLessons();
    this.focusInput();
  }

  renderTextDisplay() {
    const viewer = document.getElementById('textViewer');
    if (!viewer) return;

    let html = '';
    this.textChars.forEach((char, idx) => {
      let state = 'pending';
      if (idx < this.currentIndex) state = 'correct';
      else if (idx === this.currentIndex) state = 'current';

      // Visual space
      const displayChar = char === ' ' ? '&nbsp;' : char;
      html += `<span class="char ${state}" data-idx="${idx}">${displayChar}</span>`;
    });

    viewer.innerHTML = html;
  }

  renderKeyboard() {
    const container = document.getElementById('virtualKeyboard');
    if (!container) return;

    const layout = this.currentLayout.config;
    let html = '';

    layout.rows.forEach(row => {
      html += `<div class="keyboard-row">`;
      row.forEach(key => {
        const fingerColor = FINGER_COLORS[key.finger] || '#6366f1';
        const widthClass = key.width ? ` ${key.width}` : '';
        const qwertyChar = key.key && key.key.length === 1 ? key.key.toUpperCase() : '';

        html += `
          <div class="kb-key${widthClass}" 
               data-code="${key.code}" 
               data-finger="${key.finger}"
               style="border-bottom: 3px solid ${fingerColor};">
            <span class="key-shift-char">${key.shift || ''}</span>
            <span class="key-main-char">${key.normal || ''}</span>
            ${qwertyChar ? `<span class="key-qwerty">${qwertyChar}</span>` : ''}
          </div>
        `;
      });
      html += `</div>`;
    });

    container.innerHTML = html;
    this.renderHands();
  }

  renderHands() {
    const handsContainer = document.getElementById('handsContainer');
    if (!handsContainer) return;

    // Left hand (Fingers 1 to 5) and Right hand (Fingers 6 to 9, plus Thumb 5)
    let html = `
      <div class="hand-visual left-hand" title="बायां हाथ (Left Hand)">
        <div class="finger-rod f1" data-finger="1">
          <div class="finger-stem" style="background:${FINGER_COLORS[1]};"></div>
          <span class="finger-name-tag">कनिष्ठिका</span>
        </div>
        <div class="finger-rod f2" data-finger="2">
          <div class="finger-stem" style="background:${FINGER_COLORS[2]};"></div>
          <span class="finger-name-tag">अनामिका</span>
        </div>
        <div class="finger-rod f3" data-finger="3">
          <div class="finger-stem" style="background:${FINGER_COLORS[3]};"></div>
          <span class="finger-name-tag">मध्यमा</span>
        </div>
        <div class="finger-rod f4" data-finger="4">
          <div class="finger-stem" style="background:${FINGER_COLORS[4]};"></div>
          <span class="finger-name-tag">तर्जनी</span>
        </div>
        <div class="finger-rod f5" data-finger="5">
          <div class="finger-stem" style="background:${FINGER_COLORS[5]};"></div>
          <span class="finger-name-tag">अंगूठा</span>
        </div>
      </div>

      <div style="font-weight:700; color:var(--text-dim); font-size:0.8rem; letter-spacing:0.05em;">
        हाथ एवं उंगली मार्गदर्शिका (Hands Guide)
      </div>

      <div class="hand-visual right-hand" title="दायां हाथ (Right Hand)">
        <div class="finger-rod f5" data-finger="5">
          <div class="finger-stem" style="background:${FINGER_COLORS[5]};"></div>
          <span class="finger-name-tag">अंगूठा</span>
        </div>
        <div class="finger-rod f6" data-finger="6">
          <div class="finger-stem" style="background:${FINGER_COLORS[6]};"></div>
          <span class="finger-name-tag">तर्जनी</span>
        </div>
        <div class="finger-rod f7" data-finger="7">
          <div class="finger-stem" style="background:${FINGER_COLORS[7]};"></div>
          <span class="finger-name-tag">मध्यमा</span>
        </div>
        <div class="finger-rod f8" data-finger="8">
          <div class="finger-stem" style="background:${FINGER_COLORS[8]};"></div>
          <span class="finger-name-tag">अनामिका</span>
        </div>
        <div class="finger-rod f9" data-finger="9">
          <div class="finger-stem" style="background:${FINGER_COLORS[9]};"></div>
          <span class="finger-name-tag">कनिष्ठिका</span>
        </div>
      </div>
    `;

    handsContainer.innerHTML = html;
  }

  updateTargetHighlight() {
    if (this.currentIndex >= this.textChars.length) return;

    const targetChar = this.textChars[this.currentIndex];
    const keyInfo = this.currentLayout.charToKey[targetChar];

    // Clear previous key targets
    document.querySelectorAll('.kb-key.target-key').forEach(el => el.classList.remove('target-key'));
    document.querySelectorAll('.finger-rod.active-finger').forEach(el => el.classList.remove('active-finger'));

    const nextCharBadge = document.getElementById('nextCharBadge');
    const targetKeyHint = document.getElementById('targetKeyHint');
    const fingerNameText = document.getElementById('fingerNameText');
    const fingerDot = document.getElementById('fingerDot');

    if (nextCharBadge) {
      nextCharBadge.textContent = targetChar === ' ' ? 'स्पेस (Space)' : targetChar;
    }

    if (keyInfo) {
      // Highlight on virtual keyboard
      const targetElem = document.querySelector(`.kb-key[data-code="${keyInfo.code}"]`);
      if (targetElem) {
        targetElem.classList.add('target-key');
      }

      // If key requires Shift, also highlight Shift key
      if (keyInfo.shift) {
        const shiftElem = document.querySelector(`.kb-key[data-code="ShiftLeft"]`) || 
                          document.querySelector(`.kb-key[data-code="ShiftRight"]`);
        if (shiftElem) shiftElem.classList.add('target-key');
      }

      // Highlight active finger
      const fingerElems = document.querySelectorAll(`.finger-rod[data-finger="${keyInfo.finger}"]`);
      fingerElems.forEach(f => f.classList.add('active-finger'));

      const fingerColor = FINGER_COLORS[keyInfo.finger];
      if (fingerDot) {
        fingerDot.style.background = fingerColor;
        fingerDot.style.color = fingerColor;
      }

      if (fingerNameText) {
        fingerNameText.textContent = FINGER_NAMES[keyInfo.finger] || '';
      }

      if (targetKeyHint) {
        const qwertyHint = keyInfo.code.replace('Key', '').replace('Digit', '');
        const shiftNote = keyInfo.shift ? 'Shift + ' : '';
        targetKeyHint.textContent = `दबाएं: [${shiftNote}${qwertyHint}]`;
      }
    } else {
      // Fallback for special punctuation or native character
      if (targetKeyHint) targetKeyHint.textContent = 'कीबोर्ड पर टाइप करें';
      if (fingerNameText) fingerNameText.textContent = '';
    }
  }

  highlightPressedKey(code, isPressed) {
    const el = document.querySelector(`.kb-key[data-code="${code}"]`);
    if (el) {
      if (isPressed) {
        el.classList.add('pressed');
      } else {
        el.classList.remove('pressed');
      }
    }
  }

  handleCharacterInput(char) {
    if (this.currentIndex >= this.textChars.length) return;

    if (!this.isStarted) {
      this.isStarted = true;
      this.startTime = Date.now();
      this.startTimer();
    }

    const expectedChar = this.textChars[this.currentIndex];
    this.totalKeystrokes++;

    const charEl = document.querySelector(`.char[data-idx="${this.currentIndex}"]`);

    if (char === expectedChar) {
      this.correctCount++;
      if (charEl) {
        charEl.className = 'char correct';
      }
      if (char === ' ') {
        sound.playSpace();
      } else {
        sound.playKeyClick();
      }
      this.currentIndex++;
    } else {
      this.errorCount++;
      if (charEl) {
        charEl.className = 'char wrong';
      }
      sound.playError();
      // On error, we still advance or keep? Typing Master advances with penalty
      this.currentIndex++;
    }

    // Set next char as current
    if (this.currentIndex < this.textChars.length) {
      const nextEl = document.querySelector(`.char[data-idx="${this.currentIndex}"]`);
      if (nextEl) {
        nextEl.classList.add('current');
        // Auto scroll text viewer if needed
        nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }

    this.updateStatsDisplay();
    this.updateTargetHighlight();

    // Check if finished
    if (this.currentIndex >= this.textChars.length) {
      this.finishLesson();
    }
  }

  handleBackspace() {
    if (this.currentIndex > 0) {
      // Reset current char highlight
      const curr = document.querySelector(`.char[data-idx="${this.currentIndex}"]`);
      if (curr) curr.className = 'char pending';

      this.currentIndex--;
      const prev = document.querySelector(`.char[data-idx="${this.currentIndex}"]`);
      if (prev) {
        prev.className = 'char current';
        prev.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      this.updateStatsDisplay();
      this.updateTargetHighlight();
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.timeLimit > 0) {
        // Countdown mode (for Tests)
        this.remainingSeconds--;
        if (this.remainingSeconds <= 0) {
          this.remainingSeconds = 0;
          this.updateStatsDisplay();
          this.finishLesson();
          return;
        }
      }
      this.updateStatsDisplay();
    }, 1000);
  }

  calculateStats() {
    const elapsedSecs = this.startTime 
      ? Math.max(1, (Date.now() - this.startTime) / 1000) 
      : 1;
    const elapsedMinutes = elapsedSecs / 60;

    // Standard Typing Formula: 1 word = 5 characters
    const grossWpm = Math.round((this.totalKeystrokes / 5) / elapsedMinutes) || 0;
    const netWpm = Math.max(0, Math.round(((this.correctCount - this.errorCount) / 5) / elapsedMinutes)) || 0;
    const accuracy = this.totalKeystrokes > 0 
      ? Math.max(0, Math.min(100, Math.round((this.correctCount / this.totalKeystrokes) * 100))) 
      : 100;
    const cpm = Math.round(this.correctCount / elapsedMinutes) || 0;

    return { grossWpm, netWpm, accuracy, cpm, elapsedSecs };
  }

  updateStatsDisplay() {
    const { grossWpm, netWpm, accuracy } = this.calculateStats();

    document.getElementById('statWpm').textContent = grossWpm;
    document.getElementById('statNetWpm').textContent = netWpm;
    document.getElementById('statAccuracy').textContent = `${accuracy}%`;
    document.getElementById('statErrors').textContent = this.errorCount;

    const timeDisplay = document.getElementById('statTime');
    if (this.timeLimit > 0) {
      const mins = Math.floor(this.remainingSeconds / 60);
      const secs = this.remainingSeconds % 60;
      timeDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    } else {
      const elapsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      timeDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  finishLesson() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    sound.playCelebration();

    const stats = this.calculateStats();

    // Mark completed if accuracy is acceptable (>= 85%)
    if (this.currentLesson && !this.completedLessons.includes(this.currentLesson.id)) {
      if (stats.accuracy >= 80) {
        this.completedLessons.push(this.currentLesson.id);
        localStorage.setItem('htm_completed', JSON.stringify(this.completedLessons));
        this.renderSidebarLessons();
      }
    }

    // Save test history
    if (this.lessonMode === 'test') {
      this.testHistory.push({
        id: this.currentLesson.id,
        date: new Date().toLocaleDateString('hi-IN'),
        wpm: stats.netWpm,
        accuracy: stats.accuracy
      });
      localStorage.setItem('htm_history', JSON.stringify(this.testHistory));
    }

    // Open Results Modal
    this.openResultsModal(stats);
  }

  openResultsModal(stats) {
    const modal = document.getElementById('resultsModal');
    if (!modal) return;

    document.getElementById('modalNetWpm').textContent = stats.netWpm;
    document.getElementById('modalAccuracy').textContent = `${stats.accuracy}%`;
    document.getElementById('modalErrors').textContent = this.errorCount;
    document.getElementById('modalGrossWpm').textContent = `${stats.grossWpm} WPM`;
    document.getElementById('modalCpm').textContent = `${stats.cpm} वर्ण/मिनट`;

    let grade = 'सराहनीय (Good)';
    let badge = '⭐';
    if (stats.netWpm >= 40 && stats.accuracy >= 95) {
      grade = 'उत्कृष्ट! प्रो टाइपिस्ट (Master A+)';
      badge = '🏆';
    } else if (stats.netWpm >= 30 && stats.accuracy >= 90) {
      grade = 'बहुत बढ़िया! सरकारी परीक्षा योग्य (Grade A)';
      badge = '🎖️';
    } else if (stats.accuracy < 85) {
      grade = 'और अभ्यास की आवश्यकता (Practice Needed)';
      badge = '🎯';
    }

    document.getElementById('modalGradeText').textContent = grade;
    document.getElementById('modalBadgeIcon').textContent = badge;

    modal.classList.add('active');
  }

  closeModal() {
    document.getElementById('resultsModal')?.classList.remove('active');
  }

  resetLesson() {
    this.loadLesson(this.currentLesson, this.lessonMode);
  }

  loadNextLesson() {
    let next = null;
    let foundCurrent = false;

    for (const mod of LESSON_MODULES) {
      for (const l of mod.lessons) {
        if (foundCurrent) {
          next = l;
          break;
        }
        if (l.id === this.currentLesson?.id) {
          foundCurrent = true;
        }
      }
      if (next) break;
    }

    if (next) {
      this.loadLesson(next, 'lesson');
    } else {
      // Reached the end, switch to tests
      this.switchTab('tests');
    }
  }

  // --- Official Certificate Generator (HTML5 Canvas) ---
  openCertificateModal() {
    const modal = document.getElementById('certModal');
    if (!modal) return;
    modal.classList.add('active');
    this.renderCertificate();
  }

  renderCertificate() {
    const canvas = document.getElementById('certCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const name = document.getElementById('studentNameInput')?.value || 'कुशल परीक्षार्थी';
    const stats = this.calculateStats();
    const wpm = stats.netWpm > 0 ? stats.netWpm : 35;
    const accuracy = stats.accuracy > 0 ? stats.accuracy : 98;
    const layoutName = this.currentLayout.config.name;
    const dateStr = new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    canvas.width = 1200;
    canvas.height = 800;

    // Background gradient (Luxury Cream Parchment)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#fdfbf7');
    bgGrad.addColorStop(1, '#f7f2e7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Guilloche Double Border (Navy & Gold)
    ctx.strokeStyle = '#c5a059'; // Gold
    ctx.lineWidth = 14;
    ctx.strokeRect(28, 28, 1144, 744);

    ctx.strokeStyle = '#1e293b'; // Slate navy
    ctx.lineWidth = 2.5;
    ctx.strokeRect(44, 44, 1112, 712);

    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, 1104, 704);

    // Corner Ornaments
    this.drawCornerOrnament(ctx, 55, 55);
    this.drawCornerOrnament(ctx, 1145, 55, true);
    this.drawCornerOrnament(ctx, 55, 745, false, true);
    this.drawCornerOrnament(ctx, 1145, 745, true, true);

    // Title & Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 20px serif';
    ctx.fillText('★ ★ ★  राष्ट्रीय हिंदी टाइपिंग दक्षता परिषद  ★ ★ ★', 600, 115);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px "Noto Sans Devanagari", serif';
    ctx.fillText('दक्षता प्रमाण पत्र (CERTIFICATE OF PROFICIENCY)', 600, 175);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 18px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('यह प्रमाणित किया जाता है कि (This is to certify that)', 600, 235);

    // Student Name with Gold Underline
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 46px "Noto Sans Devanagari", serif';
    ctx.fillText(name, 600, 310);

    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 328);
    ctx.lineTo(850, 328);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#334155';
    ctx.font = '20px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('ने हिंदी टाइपिंग मास्टर प्रो पर निर्धारित मानक गति एवं सटीकता परीक्षण को', 600, 385);
    ctx.fillText('सफलतापूर्वक पूर्ण किया है और निम्नलिखित योग्यता अर्जित की है:', 600, 420);

    // Score Badges Grid
    this.drawScorePill(ctx, 320, 485, 'शुद्ध गति (Net Speed)', `${wpm} WPM`, '#6366f1');
    this.drawScorePill(ctx, 600, 485, 'सटीकता (Accuracy)', `${accuracy}%`, '#10b981');
    this.drawScorePill(ctx, 880, 485, 'कीबोर्ड लेआउट (Layout)', layoutName.split(' ')[0], '#f59e0b');

    // Bottom Details & Signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '16px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(`दिनांक (Date): ${dateStr}`, 100, 680);
    ctx.fillText(`सर्टिफिकेट आईडी: HTM-${Date.now().toString().slice(-8)}`, 100, 710);

    // Official Gold Seal in Center-Bottom
    this.drawSeal(ctx, 600, 680);

    // Signature Area
    ctx.textAlign = 'right';
    ctx.fillText('अधिकृत डिजिटल हस्ताक्षर (Authorized Seal)', 1100, 680);
    ctx.font = 'italic 18px serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('Hindi Typing Master Pro Certification Board', 1100, 710);
  }

  drawScorePill(ctx, x, y, label, val, color) {
    ctx.save();
    ctx.textAlign = 'center';
    
    // Card background
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - 110, y - 40, 220, 80, 10);
    ctx.fill();
    ctx.stroke();

    // Left color bar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - 110, y - 40, 6, 80, [10, 0, 0, 10]);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(label, x, y - 12);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(val, x, y + 22);

    ctx.restore();
  }

  drawSeal(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y - 20);

    // Outer Starburst
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fillStyle = '#c5a059';
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#997328';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#c5a059';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFIED', 0, -6);
    ctx.fillText('VERIFIED', 0, 8);
    ctx.font = '16px sans-serif';
    ctx.fillText('★', 0, 24);

    ctx.restore();
  }

  drawCornerOrnament(ctx, x, y, flipX = false, flipY = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(35, 0);
    ctx.lineTo(35, 8);
    ctx.lineTo(8, 8);
    ctx.lineTo(8, 35);
    ctx.lineTo(0, 35);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  downloadCertificate() {
    const canvas = document.getElementById('certCanvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Hindi_Typing_Certificate_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // --- Word Rain Game (शब्द वर्षा खेल) ---
  startWordRainGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 900;
    canvas.height = 420;

    this.gameRunning = true;
    this.gameScore = 0;
    this.gameLives = 5;
    this.gameWords = [];
    this.gameCurrentInput = '';

    document.getElementById('gameScoreDisplay').textContent = '0';
    document.getElementById('gameLivesDisplay').textContent = '❤️❤️❤️❤️❤️';
    document.getElementById('startGameBtn').style.display = 'none';

    let lastSpawn = Date.now();

    const gameLoop = () => {
      if (!this.gameRunning) return;

      // Update Dimensions
      ctx.fillStyle = 'rgba(11, 15, 25, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn new word every 2.2 seconds
      if (Date.now() - lastSpawn > 2200) {
        const randomWord = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
        this.gameWords.push({
          text: randomWord,
          x: 60 + Math.random() * (canvas.width - 180),
          y: -20,
          speed: 0.8 + Math.random() * 0.7,
          color: '#38bdf8'
        });
        lastSpawn = Date.now();
      }

      // Update and Draw falling words
      for (let i = this.gameWords.length - 1; i >= 0; i--) {
        const w = this.gameWords[i];
        w.y += w.speed;

        // Draw Word Box
        ctx.save();
        ctx.font = 'bold 22px "Noto Sans Devanagari", sans-serif';
        const metrics = ctx.measureText(w.text);
        const pad = 10;

        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.strokeStyle = w.text.startsWith(this.gameCurrentInput) && this.gameCurrentInput.length > 0 ? '#10b981' : '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(w.x - pad, w.y - 24, metrics.width + pad * 2, 34, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(w.text, w.x, w.y);
        ctx.restore();

        // Check if word touched ground
        if (w.y > canvas.height - 10) {
          this.gameWords.splice(i, 1);
          this.gameLives--;
          sound.playError();
          document.getElementById('gameLivesDisplay').textContent = '❤️'.repeat(Math.max(0, this.gameLives));

          if (this.gameLives <= 0) {
            this.endWordRainGame(ctx, canvas);
            return;
          }
        }
      }

      // Draw user input bar at bottom
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, canvas.height - 45, canvas.width, 45);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px "Noto Sans Devanagari", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.gameCurrentInput ? `टाइप किया: [ ${this.gameCurrentInput} ]` : 'अक्षर टाइप करके शब्द नष्ट करें...', canvas.width / 2, canvas.height - 15);
      ctx.restore();

      this.gameAnimId = requestAnimationFrame(gameLoop);
    };

    // Keyboard listener for game input
    const gameKeyHandler = (e) => {
      if (!this.gameRunning) return;
      if (e.key === 'Backspace') {
        this.gameCurrentInput = this.gameCurrentInput.slice(0, -1);
        return;
      }

      let charToType = '';
      if (this.inputMode === 'emulate') {
        const mapping = this.currentLayout.codeToChar[e.code];
        if (mapping) {
          charToType = e.shiftKey ? mapping.shift : mapping.normal;
        }
      } else {
        if (e.key.length === 1) charToType = e.key;
      }

      if (charToType) {
        sound.playKeyClick();
        this.gameCurrentInput += charToType;

        // Check if user finished any word
        const matchIdx = this.gameWords.findIndex(w => w.text === this.gameCurrentInput);
        if (matchIdx !== -1) {
          // Word hit!
          this.gameWords.splice(matchIdx, 1);
          this.gameScore += 100;
          this.gameCurrentInput = '';
          sound.playCelebration();
          document.getElementById('gameScoreDisplay').textContent = this.gameScore;
        } else {
          // Check if input doesn't prefix ANY current word
          const anyMatch = this.gameWords.some(w => w.text.startsWith(this.gameCurrentInput));
          if (!anyMatch && this.gameCurrentInput.length > 3) {
            // Reset input on miss
            this.gameCurrentInput = '';
          }
        }
      }
    };

    window.removeEventListener('keydown', this._gameHandler);
    this._gameHandler = gameKeyHandler;
    window.addEventListener('keydown', this._gameHandler);

    this.gameAnimId = requestAnimationFrame(gameLoop);
  }

  endWordRainGame(ctx, canvas) {
    this.gameRunning = false;
    cancelAnimationFrame(this.gameAnimId);

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 36px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('खेल समाप्त! (Game Over)', canvas.width / 2, canvas.height / 2 - 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(`आपका कुल स्कोर: ${this.gameScore} अंक`, canvas.width / 2, canvas.height / 2 + 15);

    document.getElementById('startGameBtn').style.display = 'inline-block';
    document.getElementById('startGameBtn').textContent = 'पुनः खेलें (Play Again)';
    ctx.restore();
  }
}

// Instantiate App when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new HindiTypingApp();
});
