/**
 * Timed Speed Test Engine
 * 1, 2, 3, 5-minute typing tests with rich text passages.
 * Calculates Net WPM, Gross WPM, Accuracy %, and ranks.
 */

window.SPEED_TEST_PASSAGES = [
    {
        id: 'tech-revolution',
        category: 'Technology & Future',
        title: 'The Digital Revolution',
        text: 'The digital revolution has transformed nearly every aspect of human life. From communication and commerce to education and healthcare, software has redefined how civilizations operate. The keyboard remains our primary bridge between human thought and digital reality. Mastering this interface allows our minds to express ideas with effortless velocity, unlocking creativity and unprecedented productivity in an increasingly connected world.'
    },
    {
        id: 'nature-wonders',
        category: 'Science & Nature',
        title: 'The Balance of Nature',
        text: 'Across ancient forests and vast oceans, ecosystems thrive on subtle balances developed over millions of years. Every organism, from microscopic phytoplankton generating oxygen to towering redwoods filtering the atmosphere, contributes to planetary harmony. Observing nature teaches patience, adaptability, and resilience in the face of continuous environmental evolution.'
    },
    {
        id: 'space-exploration',
        category: 'Science & Astronomy',
        title: 'Voyage to the Stars',
        text: 'Human curiosity has always looked upward toward the distant stars. From early astronomers charting constellations to modern space telescopes capturing the birth of distant galaxies, we seek to understand our place in the cosmos. Humanity stands at the dawn of interplanetary exploration, propelled by courage, science, and the relentless quest for knowledge.'
    },
    {
        id: 'literature-courage',
        category: 'Inspiration & Wisdom',
        title: 'The Essence of Perseverance',
        text: 'Perseverance is not a long race; it is many short races one after another. Success rarely arrives in a single dramatic triumph, but through quiet daily habits repeated with discipline. When obstacles arise, the determined mind finds opportunity where others see defeat. The journey itself shapes our character far more than the destination.'
    }
];

class SpeedTestEngine {
    constructor() {
        this.selectedDuration = 60; // default 1 minute (60s)
        this.selectedPassage = window.SPEED_TEST_PASSAGES[0];
        this.timeLeft = 60;
        this.timerInterval = null;
        this.isRunning = false;
        this.isCompleted = false;

        this.targetText = '';
        this.currentIndex = 0;
        this.errorCount = 0;
        this.totalKeystrokes = 0;
        this.lastResult = null;

        this.initDOM();
    }

    initDOM() {
        this.testTextContainer = document.getElementById('test-text-display');
        this.timerCountdownEl = document.getElementById('test-countdown');
        this.testWpmEl = document.getElementById('test-live-wpm');
        this.testAccEl = document.getElementById('test-live-acc');
        this.testNetWpmEl = document.getElementById('test-live-net');

        // Passage selector
        const passageSelect = document.getElementById('test-passage-select');
        if (passageSelect) {
            passageSelect.innerHTML = window.SPEED_TEST_PASSAGES.map(p =>
                `<option value="${p.id}">${p.title} (${p.category})</option>`
            ).join('');
            passageSelect.addEventListener('change', (e) => {
                const found = window.SPEED_TEST_PASSAGES.find(p => p.id === e.target.value);
                if (found) {
                    this.selectedPassage = found;
                    this.resetTest();
                }
            });
        }

        // Duration selector buttons
        document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDuration = parseInt(btn.dataset.seconds, 10);
                this.resetTest();
            });
        });

        // Keydown listener
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    resetTest() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isCompleted = false;
        this.timeLeft = this.selectedDuration;
        this.currentIndex = 0;
        this.errorCount = 0;
        this.totalKeystrokes = 0;
        this.targetText = this.selectedPassage.text;

        this.updateCountdownDisplay();
        if (this.testWpmEl) this.testWpmEl.textContent = '0';
        if (this.testAccEl) this.testAccEl.textContent = '100%';
        if (this.testNetWpmEl) this.testNetWpmEl.textContent = '0';

        this.renderText();
    }

    renderText() {
        if (!this.testTextContainer) return;
        this.testTextContainer.innerHTML = '';

        for (let i = 0; i < this.targetText.length; i++) {
            const span = document.createElement('span');
            span.className = 'char-box';
            span.id = `test-char-${i}`;

            const char = this.targetText[i];
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.classList.add('is-space');
            } else {
                span.textContent = char;
            }

            if (i === 0) span.classList.add('current');
            this.testTextContainer.appendChild(span);
        }
    }

    handleKeyDown(e) {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab || activeTab.id !== 'tab-speedtest') return;
        if (this.isCompleted) return;

        // Visual key press
        if (window.keyboardVisualizer) {
            window.keyboardVisualizer.pressKey(e.code);
        }

        if (e.key === ' ' || e.key === 'Tab') e.preventDefault();

        // Backspace
        if (e.key === 'Backspace') {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                const prevSpan = document.getElementById(`test-char-${this.currentIndex}`);
                if (prevSpan) prevSpan.className = 'char-box current';
                const nextSpan = document.getElementById(`test-char-${this.currentIndex + 1}`);
                if (nextSpan) nextSpan.classList.remove('current');
            }
            return;
        }

        if (e.key.length > 1 && e.key !== 'Enter') return;

        // Start timer on first keypress
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateCountdownDisplay();
                this.calculateLiveStats();

                if (this.timeLeft <= 0) {
                    this.finishTest();
                }
            }, 1000);
        }

        this.totalKeystrokes++;
        const expectedChar = this.targetText[this.currentIndex];
        const typedChar = e.key;
        const currentSpan = document.getElementById(`test-char-${this.currentIndex}`);

        if (typedChar === expectedChar) {
            if (window.soundEngine) window.soundEngine.playKeySound();
            if (window.storageManager) window.storageManager.recordKeyPress(expectedChar, true);

            if (currentSpan) {
                currentSpan.classList.remove('current');
                currentSpan.classList.add('correct');
            }

            this.currentIndex++;

            if (this.currentIndex >= this.targetText.length) {
                this.finishTest();
                return;
            }

            const nextSpan = document.getElementById(`test-char-${this.currentIndex}`);
            if (nextSpan) {
                nextSpan.classList.add('current');
                nextSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        } else {
            this.errorCount++;
            if (window.soundEngine) window.soundEngine.playErrorSound();
            if (window.storageManager) window.storageManager.recordKeyPress(expectedChar, false);
            if (window.keyboardVisualizer) window.keyboardVisualizer.flashErrorKey(typedChar);

            if (currentSpan) currentSpan.classList.add('incorrect');
        }

        this.calculateLiveStats();
    }

    calculateLiveStats() {
        const timeElapsed = this.selectedDuration - this.timeLeft;
        if (timeElapsed <= 0 || this.currentIndex === 0) return;

        const minutes = timeElapsed / 60;
        const grossWpm = Math.round((this.currentIndex / 5) / minutes);
        const accuracy = Math.max(0, Math.round(((this.totalKeystrokes - this.errorCount) / this.totalKeystrokes) * 100));
        const netWpm = Math.max(0, Math.round(grossWpm - (this.errorCount / minutes)));

        if (this.testWpmEl) this.testWpmEl.textContent = grossWpm;
        if (this.testAccEl) this.testAccEl.textContent = `${accuracy}%`;
        if (this.testNetWpmEl) this.testNetWpmEl.textContent = netWpm;
    }

    updateCountdownDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        if (this.timerCountdownEl) {
            this.timerCountdownEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    }

    finishTest() {
        this.isCompleted = true;
        this.isRunning = false;
        clearInterval(this.timerInterval);

        if (window.soundEngine) window.soundEngine.playSuccessChime();

        const timeElapsed = Math.max(1, this.selectedDuration - this.timeLeft);
        const minutes = timeElapsed / 60;
        const grossWpm = Math.round((this.currentIndex / 5) / minutes);
        const accuracy = Math.round(((this.totalKeystrokes - this.errorCount) / Math.max(1, this.totalKeystrokes)) * 100);
        const netWpm = Math.max(0, Math.round(grossWpm - (this.errorCount / minutes)));

        // Determine Speed Rank
        let rank = 'Beginner';
        let badgeColor = '#94a3b8';
        if (netWpm >= 70) { rank = 'Grand Master'; badgeColor = '#eab308'; }
        else if (netWpm >= 55) { rank = 'Pro Typist'; badgeColor = '#a855f7'; }
        else if (netWpm >= 40) { rank = 'Fluent'; badgeColor = '#3b82f6'; }
        else if (netWpm >= 25) { rank = 'Intermediate'; badgeColor = '#10b981'; }

        this.lastResult = {
            durationSeconds: timeElapsed,
            wpm: grossWpm,
            netWpm: netWpm,
            accuracy: accuracy,
            errors: this.errorCount,
            keystrokes: this.totalKeystrokes,
            rank: rank,
            category: this.selectedPassage.category
        };

        if (window.storageManager) {
            window.storageManager.addTestResult(this.lastResult);
        }

        this.showResultsModal(this.lastResult);
    }

    showResultsModal(res) {
        const modal = document.getElementById('test-results-modal');
        if (!modal) return;

        document.getElementById('res-net-wpm').textContent = res.netWpm;
        document.getElementById('res-gross-wpm').textContent = res.wpm;
        document.getElementById('res-accuracy').textContent = `${res.accuracy}%`;
        document.getElementById('res-errors').textContent = res.errors;
        document.getElementById('res-keystrokes').textContent = res.keystrokes;

        const rankBadge = document.getElementById('res-rank-badge');
        if (rankBadge) {
            rankBadge.textContent = res.rank;
        }

        const certBtn = document.getElementById('modal-btn-view-certificate');
        if (certBtn) {
            certBtn.onclick = () => {
                modal.classList.remove('open');
                if (window.certificateManager) {
                    window.certificateManager.openCertificate(res);
                }
            };
        }

        const retryBtn = document.getElementById('modal-btn-retry-test');
        if (retryBtn) {
            retryBtn.onclick = () => {
                modal.classList.remove('open');
                this.resetTest();
            };
        }

        modal.classList.add('open');
    }
}

window.SpeedTestEngine = SpeedTestEngine;
