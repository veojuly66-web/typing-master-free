/**
 * Typing Master Arcade: Falling Words / Word Drops
 * Classic arcade game where words float down from the sky.
 * Type them before they hit the red laser line at the bottom!
 */

class FallingWordsGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.wordsPool = [
            'fast', 'type', 'code', 'home', 'star', 'blue', 'gold', 'pure', 'jump', 'flow',
            'quick', 'speed', 'laser', 'focus', 'light', 'track', 'skill', 'smart', 'cloud',
            'master', 'engine', 'future', 'rocket', 'galaxy', 'matrix', 'stream', 'vector',
            'keyboard', 'terminal', 'accuracy', 'velocity', 'champion', 'dynamo', 'infinity'
        ];

        this.activeWords = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.wordsTypedCount = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 120; // frames
        this.baseSpeed = 1.0;
        this.targetWord = null; // Currently targeted word

        this.isRunning = false;
        this.animationId = null;

        this.initDOM();
    }

    initDOM() {
        if (!this.canvas) return;
        this.resize();
        window.addEventListener('resize', () => this.resize());

        const startBtn = document.getElementById('btn-start-game');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        const pauseBtn = document.getElementById('btn-pause-game');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = Math.max(600, rect.width || 800);
        this.canvas.height = 480;
    }

    startGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.wordsTypedCount = 0;
        this.activeWords = [];
        this.particles = [];
        this.targetWord = null;
        this.baseSpeed = 1.0;
        this.spawnInterval = 120;
        this.isRunning = true;

        this.updateHUD();
        document.getElementById('game-overlay').style.display = 'none';

        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.loop();
    }

    togglePause() {
        if (!this.isRunning) return;
        this.isRunning = !this.isRunning;
        const pauseBtn = document.getElementById('btn-pause-game');
        if (this.isRunning) {
            if (pauseBtn) pauseBtn.textContent = 'Pause';
            this.loop();
        } else {
            if (pauseBtn) pauseBtn.textContent = 'Resume';
            cancelAnimationFrame(this.animationId);
        }
    }

    spawnWord() {
        const wordText = this.wordsPool[Math.floor(Math.random() * this.wordsPool.length)];
        const textWidth = wordText.length * 16;
        const x = Math.random() * (this.canvas.width - textWidth - 60) + 30;

        this.activeWords.push({
            text: wordText,
            typed: '',
            x: x,
            y: 30,
            speed: this.baseSpeed + Math.random() * 0.5,
            color: '#38bdf8'
        });
    }

    handleKeyDown(e) {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab || activeTab.id !== 'tab-games') return;
        if (!this.isRunning) return;

        if (e.key === ' ' || e.key === 'Tab') e.preventDefault();
        if (e.key.length > 1) return;

        const char = e.key.toLowerCase();

        // If currently locked onto a word
        if (this.targetWord) {
            const nextNeededChar = this.targetWord.text[this.targetWord.typed.length].toLowerCase();
            if (char === nextNeededChar) {
                this.targetWord.typed += this.targetWord.text[this.targetWord.typed.length];
                if (window.soundEngine) window.soundEngine.playKeySound();

                // Word finished?
                if (this.targetWord.typed.length === this.targetWord.text.length) {
                    this.destroyWord(this.targetWord);
                    this.targetWord = null;
                }
            } else {
                // Wrong key
                if (window.soundEngine) window.soundEngine.playErrorSound();
                this.combo = 0;
                this.updateHUD();
            }
            return;
        }

        // Find candidate word whose first letter matches and is lowest on screen
        const candidates = this.activeWords
            .filter(w => w.text[0].toLowerCase() === char)
            .sort((a, b) => b.y - a.y);

        if (candidates.length > 0) {
            this.targetWord = candidates[0];
            this.targetWord.typed = this.targetWord.text[0];
            if (window.soundEngine) window.soundEngine.playKeySound();

            if (this.targetWord.typed.length === this.targetWord.text.length) {
                this.destroyWord(this.targetWord);
                this.targetWord = null;
            }
        } else {
            if (window.soundEngine) window.soundEngine.playErrorSound();
            this.combo = 0;
            this.updateHUD();
        }
    }

    destroyWord(word) {
        if (window.soundEngine) window.soundEngine.playExplosionSound();

        // Spawn particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: word.x + (word.text.length * 8),
                y: word.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: Math.random() * 4 + 2,
                color: ['#f59e0b', '#38bdf8', '#10b981', '#ec4899'][Math.floor(Math.random() * 4)],
                alpha: 1,
                life: 30
            });
        }

        // Remove from active
        this.activeWords = this.activeWords.filter(w => w !== word);

        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        this.score += word.text.length * 10 * Math.min(this.combo, 5);
        this.wordsTypedCount++;

        // Level up check every 10 words
        if (this.wordsTypedCount % 10 === 0) {
            this.level++;
            this.baseSpeed += 0.25;
            this.spawnInterval = Math.max(60, this.spawnInterval - 10);
        }

        this.updateHUD();
    }

    loop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.loop());
    }

    update() {
        // Spawn
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnWord();
        }

        // Update words position
        const laserY = this.canvas.height - 40;
        for (let i = this.activeWords.length - 1; i >= 0; i--) {
            const w = this.activeWords[i];
            w.y += w.speed;

            if (w.y >= laserY) {
                // Word hit bottom!
                if (w === this.targetWord) this.targetWord = null;
                this.activeWords.splice(i, 1);
                this.lives--;
                this.combo = 0;
                if (window.soundEngine) window.soundEngine.playErrorSound();
                this.updateHUD();

                if (this.lives <= 0) {
                    this.gameOver();
                    return;
                }
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 1 / p.life;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Background subtle grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Danger Laser line at bottom
        const laserY = this.canvas.height - 40;
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.moveTo(0, laserY);
        this.ctx.lineTo(this.canvas.width, laserY);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0; // reset

        // Draw words
        this.ctx.font = 'bold 20px "Courier New", monospace';
        this.activeWords.forEach(w => {
            const isTarget = w === this.targetWord;
            const textWidth = this.ctx.measureText(w.text).width;

            // Bubble pill background
            this.ctx.fillStyle = isTarget ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.75)';
            this.ctx.strokeStyle = isTarget ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = isTarget ? 2 : 1;

            const paddingX = 14;
            const paddingY = 8;
            const boxX = w.x - paddingX;
            const boxY = w.y - 18 - paddingY;
            const boxW = textWidth + paddingX * 2;
            const boxH = 26 + paddingY;

            this.ctx.beginPath();
            this.ctx.roundRect(boxX, boxY, boxW, boxH, 8);
            this.ctx.fill();
            this.ctx.stroke();

            // Highlight typed part vs remaining
            const typedPart = w.typed;
            const remainingPart = w.text.substring(typedPart.length);

            // Typed letters (Gold/Green)
            this.ctx.fillStyle = '#10b981';
            this.ctx.fillText(typedPart, w.x, w.y);

            // Remaining letters (White)
            const typedWidth = this.ctx.measureText(typedPart).width;
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.fillText(remainingPart, w.x + typedWidth, w.y);
        });

        // Draw particles
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    updateHUD() {
        const scoreEl = document.getElementById('game-hud-score');
        const livesEl = document.getElementById('game-hud-lives');
        const levelEl = document.getElementById('game-hud-level');
        const comboEl = document.getElementById('game-hud-combo');

        if (scoreEl) scoreEl.textContent = this.score;
        if (livesEl) livesEl.innerHTML = '❤️'.repeat(this.lives) + '🖤'.repeat(Math.max(0, 3 - this.lives));
        if (levelEl) levelEl.textContent = `Lvl ${this.level}`;
        if (comboEl) comboEl.textContent = this.combo > 1 ? `${this.combo}x Combo!` : '';
    }

    gameOver() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);

        let isNewHigh = false;
        if (window.storageManager) {
            isNewHigh = window.storageManager.saveGameHighScore(this.score);
        }

        const overlay = document.getElementById('game-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="game-over-box">
                    <h2 class="text-3xl font-bold text-red-400 mb-2">Game Over!</h2>
                    <p class="text-gray-300 mb-4">The words breached your defense barrier.</p>
                    <div class="text-4xl font-extrabold text-amber-400 mb-2">${this.score} pts</div>
                    ${isNewHigh ? '<div class="badge badge-gold mb-4">🎉 NEW HIGH SCORE!</div>' : ''}
                    <div class="text-sm text-gray-400 mb-6">Words Defeated: ${this.wordsTypedCount} | Max Combo: ${this.maxCombo}x</div>
                    <button id="btn-restart-game" class="btn btn-primary px-6 py-3 text-lg font-bold">Play Again</button>
                </div>
            `;
            overlay.style.display = 'flex';

            const restartBtn = document.getElementById('btn-restart-game');
            if (restartBtn) restartBtn.onclick = () => this.startGame();
        }
    }
}

window.FallingWordsGame = FallingWordsGame;
