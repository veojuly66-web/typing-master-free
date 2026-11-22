/**
 * Lesson Practice Engine
 * Handles character-by-character typing with animated caret, error detection,
 * live WPM & accuracy calculation, and completion scoring.
 */

class PracticeEngine {
    constructor() {
        this.currentLesson = null;
        this.targetText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.errorCount = 0;
        this.totalKeystrokes = 0;
        this.isCompleted = false;
        this.isRunning = false;

        this.textDisplayEl = document.getElementById('lesson-text-display');
        this.wpmEl = document.getElementById('live-wpm');
        this.accuracyEl = document.getElementById('live-accuracy');
        this.progressEl = document.getElementById('live-progress');
        this.timerEl = document.getElementById('live-timer');

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => {
            if (window.keyboardVisualizer) {
                window.keyboardVisualizer.releaseKey(e.code);
            }
        });
    }

    startLesson(lesson) {
        this.currentLesson = lesson;
        this.targetText = lesson.text;
        this.currentIndex = 0;
        this.errorCount = 0;
        this.totalKeystrokes = 0;
        this.startTime = null;
        this.isCompleted = false;
        this.isRunning = false;

        if (this.timerInterval) clearInterval(this.timerInterval);

        // Update UI Info
        document.getElementById('lesson-title-display').textContent = lesson.title;
        document.getElementById('lesson-instruction-display').textContent = lesson.instructions;

        const fingersDisplay = document.getElementById('lesson-fingers-display');
        if (fingersDisplay) {
            fingersDisplay.innerHTML = lesson.fingers.map(f => `<span class="badge badge-accent">${f}</span>`).join(' ');
        }

        this.renderText();
        this.updateStats();

        // Highlight first character
        if (window.keyboardVisualizer) {
            window.keyboardVisualizer.highlightTarget(this.targetText[0]);
        }
    }

    renderText() {
        if (!this.textDisplayEl) return;
        this.textDisplayEl.innerHTML = '';

        for (let i = 0; i < this.targetText.length; i++) {
            const span = document.createElement('span');
            span.className = 'char-box';
            span.id = `char-${i}`;

            const char = this.targetText[i];
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.classList.add('is-space');
            } else {
                span.textContent = char;
            }

            if (i === 0) {
                span.classList.add('current');
            }

            this.textDisplayEl.appendChild(span);
        }
    }

    handleKeyDown(e) {
        // Only active if current tab is 'lesson-practice'
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab || activeTab.id !== 'tab-lessons') return;
        if (this.isCompleted || !this.targetText) return;

        // Visual key press
        if (window.keyboardVisualizer) {
            window.keyboardVisualizer.pressKey(e.code);
        }

        // Prevent page scrolling on Space / Tab
        if (e.key === ' ' || e.key === 'Tab') {
            e.preventDefault();
        }

        // Backspace handling
        if (e.key === 'Backspace') {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                const prevSpan = document.getElementById(`char-${this.currentIndex}`);
                if (prevSpan) {
                    prevSpan.className = 'char-box current';
                }
                const nextSpan = document.getElementById(`char-${this.currentIndex + 1}`);
                if (nextSpan) {
                    nextSpan.classList.remove('current');
                }
                if (window.keyboardVisualizer) {
                    window.keyboardVisualizer.highlightTarget(this.targetText[this.currentIndex]);
                }
            }
            return;
        }

        // Ignore modifier keys
        if (e.key.length > 1 && e.key !== 'Enter') return;

        // Start timer on first keystroke
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            this.timerInterval = setInterval(() => this.updateTimerAndSpeed(), 500);
        }

        this.totalKeystrokes++;
        const expectedChar = this.targetText[this.currentIndex];
        const typedChar = e.key;

        const currentSpan = document.getElementById(`char-${this.currentIndex}`);

        if (typedChar === expectedChar) {
            // Correct key
            if (window.soundEngine) {
                window.soundEngine.playKeySound();
            }
            if (window.storageManager) {
                window.storageManager.recordKeyPress(expectedChar, true);
            }

            if (currentSpan) {
                currentSpan.classList.remove('current');
                currentSpan.classList.add('correct');
            }

            this.currentIndex++;

            if (this.currentIndex >= this.targetText.length) {
                this.completeLesson();
                return;
            }

            const nextSpan = document.getElementById(`char-${this.currentIndex}`);
            if (nextSpan) {
                nextSpan.classList.add('current');
                // Auto-scroll inside container if needed
                nextSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }

            if (window.keyboardVisualizer) {
                window.keyboardVisualizer.highlightTarget(this.targetText[this.currentIndex]);
            }
        } else {
            // Mistake
            this.errorCount++;
            if (window.soundEngine) {
                window.soundEngine.playErrorSound();
            }
            if (window.storageManager) {
                window.storageManager.recordKeyPress(expectedChar, false);
            }
            if (window.keyboardVisualizer) {
                window.keyboardVisualizer.flashErrorKey(typedChar);
            }

            if (currentSpan) {
                currentSpan.classList.add('incorrect');
            }
        }

        this.updateStats();
    }

    updateTimerAndSpeed() {
        if (!this.startTime) return;
        const elapsedSec = (Date.now() - this.startTime) / 1000;
        const minutes = Math.floor(elapsedSec / 60);
        const seconds = Math.floor(elapsedSec % 60);
        if (this.timerEl) {
            this.timerEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        this.updateStats();
    }

    updateStats() {
        if (!this.startTime || this.currentIndex === 0) {
            if (this.wpmEl) this.wpmEl.textContent = '0';
            if (this.accuracyEl) this.accuracyEl.textContent = '100%';
            if (this.progressEl) this.progressEl.textContent = '0%';
            return;
        }

        const elapsedMin = Math.max((Date.now() - this.startTime) / 60000, 0.05);
        const wordsTyped = this.currentIndex / 5;
        const grossWpm = Math.round(wordsTyped / elapsedMin);

        const accuracy = Math.max(0, Math.round(((this.totalKeystrokes - this.errorCount) / this.totalKeystrokes) * 100));
        const progressPct = Math.min(100, Math.round((this.currentIndex / this.targetText.length) * 100));

        if (this.wpmEl) this.wpmEl.textContent = grossWpm;
        if (this.accuracyEl) this.accuracyEl.textContent = `${accuracy}%`;
        if (this.progressEl) this.progressEl.textContent = `${progressPct}%`;
    }

    completeLesson() {
        this.isCompleted = true;
        this.isRunning = false;
        clearInterval(this.timerInterval);

        if (window.soundEngine) {
            window.soundEngine.playSuccessChime();
        }

        const elapsedMin = Math.max((Date.now() - this.startTime) / 60000, 0.05);
        const wpm = Math.round((this.currentIndex / 5) / elapsedMin);
        const accuracy = Math.round(((this.totalKeystrokes - this.errorCount) / this.totalKeystrokes) * 100);

        // Find next lesson
        const lessonInfo = window.getLessonById(this.currentLesson.id);
        const nextId = lessonInfo && lessonInfo.nextLesson ? lessonInfo.nextLesson.id : null;

        let stars = 1;
        if (window.storageManager) {
            stars = window.storageManager.recordLessonCompletion(this.currentLesson.id, wpm, accuracy, nextId);
            if (typeof updateSummaryStats === 'function') updateSummaryStats();
            if (typeof renderLessonCatalog === 'function') renderLessonCatalog();
        }

        // Show modal
        this.showCompletionModal(wpm, accuracy, stars, nextId);
    }

    showCompletionModal(wpm, accuracy, stars, nextId) {
        const modal = document.getElementById('lesson-completion-modal');
        if (!modal) return;

        document.getElementById('modal-final-wpm').textContent = wpm;
        document.getElementById('modal-final-acc').textContent = `${accuracy}%`;
        document.getElementById('modal-final-errors').textContent = this.errorCount;

        const starContainer = document.getElementById('modal-stars');
        if (starContainer) {
            starContainer.innerHTML = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        }

        const nextBtn = document.getElementById('modal-btn-next-lesson');
        if (nextBtn) {
            if (nextId) {
                nextBtn.style.display = 'inline-block';
                nextBtn.onclick = () => {
                    modal.classList.remove('open');
                    const next = window.getLessonById(nextId);
                    if (next) this.startLesson(next.lesson);
                };
            } else {
                nextBtn.style.display = 'none';
            }
        }

        const retryBtn = document.getElementById('modal-btn-retry');
        if (retryBtn) {
            retryBtn.onclick = () => {
                modal.classList.remove('open');
                this.startLesson(this.currentLesson);
            };
        }

        modal.classList.add('open');
    }
}

window.practiceEngine = null;
