/**
 * Virtual Keyboard and Hands Visualizer
 * Provides the classic Typing Master interactive keyboard layout and hand guides
 * showing which finger to use for every character.
 */

class KeyboardVisualizer {
    constructor(containerId, handsContainerId) {
        this.container = document.getElementById(containerId);
        this.handsContainer = document.getElementById(handsContainerId);
        this.fingerMap = {
            // Left Hand
            lp: { name: 'Left Pinky', color: '#ec4899', hand: 'left', finger: 'pinky' },
            lr: { name: 'Left Ring', color: '#8b5cf6', hand: 'left', finger: 'ring' },
            lm: { name: 'Left Middle', color: '#3b82f6', hand: 'left', finger: 'middle' },
            li: { name: 'Left Index', color: '#06b6d4', hand: 'left', finger: 'index' },
            th: { name: 'Thumb', color: '#10b981', hand: 'thumb', finger: 'thumb' },
            // Right Hand
            ri: { name: 'Right Index', color: '#f59e0b', hand: 'right', finger: 'index' },
            rm: { name: 'Right Middle', color: '#84cc16', hand: 'right', finger: 'middle' },
            rr: { name: 'Right Ring', color: '#eab308', hand: 'right', finger: 'ring' },
            rp: { name: 'Right Pinky', color: '#f43f5e', hand: 'right', finger: 'pinky' }
        };

        // Key to finger code mapping
        this.keyToFinger = {
            '`': 'lp', '~': 'lp', '1': 'lp', '!': 'lp', 'q': 'lp', 'a': 'lp', 'z': 'lp', 'Tab': 'lp', 'CapsLock': 'lp', 'ShiftLeft': 'lp',
            '2': 'lr', '@': 'lr', 'w': 'lr', 's': 'lr', 'x': 'lr',
            '3': 'lm', '#': 'lm', 'e': 'lm', 'd': 'lm', 'c': 'lm',
            '4': 'li', '$': 'li', '5': 'li', '%': 'li', 'r': 'li', 't': 'li', 'f': 'li', 'g': 'li', 'v': 'li', 'b': 'li',
            ' ': 'th', 'Space': 'th',
            '6': 'ri', '^': 'ri', '7': 'ri', '&': 'ri', 'y': 'ri', 'u': 'ri', 'h': 'ri', 'j': 'ri', 'n': 'ri', 'm': 'ri',
            '8': 'rm', '*': 'rm', 'i': 'rm', 'k': 'rm', ',': 'rm', '<': 'rm',
            '9': 'rr', '(': 'rr', 'o': 'rr', 'l': 'rr', '.': 'rr', '>': 'rr',
            '0': 'rp', ')': 'rp', '-': 'rp', '_': 'rp', '=': 'rp', '+': 'rp',
            'p': 'rp', '[': 'rp', '{': 'rp', ']': 'rp', '}': 'rp', '\\': 'rp', '|': 'rp',
            ';': 'rp', ':': 'rp', '\'': 'rp', '"': 'rp', '/': 'rp', '?': 'rp',
            'Enter': 'rp', 'Backspace': 'rp', 'ShiftRight': 'rp'
        };

        this.keyboardRows = [
            [
                { key: '`', shift: '~', code: 'Backquote', finger: 'lp', width: 'w-10' },
                { key: '1', shift: '!', code: 'Digit1', finger: 'lp' },
                { key: '2', shift: '@', code: 'Digit2', finger: 'lr' },
                { key: '3', shift: '#', code: 'Digit3', finger: 'lm' },
                { key: '4', shift: '$', code: 'Digit4', finger: 'li' },
                { key: '5', shift: '%', code: 'Digit5', finger: 'li' },
                { key: '6', shift: '^', code: 'Digit6', finger: 'ri' },
                { key: '7', shift: '&', code: 'Digit7', finger: 'ri' },
                { key: '8', shift: '*', code: 'Digit8', finger: 'rm' },
                { key: '9', shift: '(', code: 'Digit9', finger: 'rr' },
                { key: '0', shift: ')', code: 'Digit0', finger: 'rp' },
                { key: '-', shift: '_', code: 'Minus', finger: 'rp' },
                { key: '=', shift: '+', code: 'Equal', finger: 'rp' },
                { key: 'Backspace', code: 'Backspace', finger: 'rp', width: 'w-20' }
            ],
            [
                { key: 'Tab', code: 'Tab', finger: 'lp', width: 'w-16' },
                { key: 'q', shift: 'Q', code: 'KeyQ', finger: 'lp' },
                { key: 'w', shift: 'W', code: 'KeyW', finger: 'lr' },
                { key: 'e', shift: 'E', code: 'KeyE', finger: 'lm' },
                { key: 'r', shift: 'R', code: 'KeyR', finger: 'li' },
                { key: 't', shift: 'T', code: 'KeyT', finger: 'li' },
                { key: 'y', shift: 'Y', code: 'KeyY', finger: 'ri' },
                { key: 'u', shift: 'U', code: 'KeyU', finger: 'ri' },
                { key: 'i', shift: 'I', code: 'KeyI', finger: 'rm' },
                { key: 'o', shift: 'O', code: 'KeyO', finger: 'rr' },
                { key: 'p', shift: 'P', code: 'KeyP', finger: 'rp' },
                { key: '[', shift: '{', code: 'BracketLeft', finger: 'rp' },
                { key: ']', shift: '}', code: 'BracketRight', finger: 'rp' },
                { key: '\\', shift: '|', code: 'Backslash', finger: 'rp', width: 'w-14' }
            ],
            [
                { key: 'Caps', code: 'CapsLock', finger: 'lp', width: 'w-18' },
                { key: 'a', shift: 'A', code: 'KeyA', finger: 'lp' },
                { key: 's', shift: 'S', code: 'KeyS', finger: 'lr' },
                { key: 'd', shift: 'D', code: 'KeyD', finger: 'lm' },
                { key: 'f', shift: 'F', code: 'KeyF', finger: 'li', isNub: true },
                { key: 'g', shift: 'G', code: 'KeyG', finger: 'li' },
                { key: 'h', shift: 'H', code: 'KeyH', finger: 'ri' },
                { key: 'j', shift: 'J', code: 'KeyJ', finger: 'ri', isNub: true },
                { key: 'k', shift: 'K', code: 'KeyK', finger: 'rm' },
                { key: 'l', shift: 'L', code: 'KeyL', finger: 'rr' },
                { key: ';', shift: ':', code: 'Semicolon', finger: 'rp' },
                { key: '\'', shift: '"', code: 'Quote', finger: 'rp' },
                { key: 'Enter', code: 'Enter', finger: 'rp', width: 'w-22' }
            ],
            [
                { key: 'Shift', code: 'ShiftLeft', finger: 'lp', width: 'w-24' },
                { key: 'z', shift: 'Z', code: 'KeyZ', finger: 'lp' },
                { key: 'x', shift: 'X', code: 'KeyX', finger: 'lr' },
                { key: 'c', shift: 'C', code: 'KeyC', finger: 'lm' },
                { key: 'v', shift: 'V', code: 'KeyV', finger: 'li' },
                { key: 'b', shift: 'B', code: 'KeyB', finger: 'li' },
                { key: 'n', shift: 'N', code: 'KeyN', finger: 'ri' },
                { key: 'm', shift: 'M', code: 'KeyM', finger: 'ri' },
                { key: ',', shift: '<', code: 'Comma', finger: 'rm' },
                { key: '.', shift: '>', code: 'Period', finger: 'rr' },
                { key: '/', shift: '?', code: 'Slash', finger: 'rp' },
                { key: 'Shift', code: 'ShiftRight', finger: 'rp', width: 'w-26' }
            ],
            [
                { key: 'Ctrl', code: 'ControlLeft', finger: 'lp', width: 'w-16' },
                { key: 'Alt', code: 'AltLeft', finger: 'th', width: 'w-14' },
                { key: 'Space', code: 'Space', finger: 'th', width: 'w-80' },
                { key: 'Alt', code: 'AltRight', finger: 'th', width: 'w-14' },
                { key: 'Ctrl', code: 'ControlRight', finger: 'rp', width: 'w-16' }
            ]
        ];

        this.init();
    }

    init() {
        this.renderKeyboard();
        this.renderHands();
    }

    renderKeyboard() {
        if (!this.container) return;
        this.container.innerHTML = '';

        const kbWrapper = document.createElement('div');
        kbWrapper.className = 'keyboard-grid';

        this.keyboardRows.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'keyboard-row';

            row.forEach(k => {
                const keyEl = document.createElement('div');
                keyEl.className = `key-cap ${k.width || ''} finger-${k.finger}`;
                keyEl.dataset.key = k.key.toLowerCase();
                if (k.shift) keyEl.dataset.shift = k.shift;
                keyEl.dataset.code = k.code;
                keyEl.dataset.finger = k.finger;

                let labelHtml = '';
                if (k.shift && k.shift !== k.key.toUpperCase()) {
                    labelHtml = `<span class="key-shift">${k.shift}</span><span class="key-main">${k.key}</span>`;
                } else {
                    labelHtml = `<span class="key-main">${k.key.toUpperCase()}</span>`;
                }

                if (k.isNub) {
                    labelHtml += `<div class="tactile-nub"></div>`;
                }

                keyEl.innerHTML = labelHtml;
                rowEl.appendChild(keyEl);
            });

            kbWrapper.appendChild(rowEl);
        });

        this.container.appendChild(kbWrapper);
    }

    renderHands() {
        if (!this.handsContainer) return;
        this.handsContainer.innerHTML = `
            <div class="hands-visualizer-wrap">
                <div class="hand-container left-hand">
                    <div class="hand-label">Left Hand</div>
                    <div class="hand-fingers-svg">
                        <svg viewBox="0 0 200 160" class="hand-svg">
                            <!-- Palm Base -->
                            <path class="palm" d="M40,90 Q40,150 100,150 Q160,150 160,90 Q160,70 140,60 L140,110 L60,110 L40,90 Z" fill="rgba(255,255,255,0.08)" stroke="currentColor" stroke-width="2"/>
                            <!-- Pinky -->
                            <rect id="f-left-pinky" class="finger-pill" x="35" y="45" width="20" height="55" rx="10" />
                            <!-- Ring -->
                            <rect id="f-left-ring" class="finger-pill" x="65" y="25" width="22" height="75" rx="11" />
                            <!-- Middle -->
                            <rect id="f-left-middle" class="finger-pill" x="95" y="15" width="24" height="85" rx="12" />
                            <!-- Index -->
                            <rect id="f-left-index" class="finger-pill" x="128" y="28" width="22" height="72" rx="11" />
                            <!-- Thumb -->
                            <rect id="f-left-thumb" class="finger-pill thumb" x="155" y="80" width="22" height="50" rx="11" transform="rotate(35 155 80)" />
                        </svg>
                        <div class="finger-names-row">
                            <span class="fname text-pinky">Pinky</span>
                            <span class="fname text-ring">Ring</span>
                            <span class="fname text-middle">Mid</span>
                            <span class="fname text-index">Index</span>
                            <span class="fname text-thumb">Thumb</span>
                        </div>
                    </div>
                </div>

                <div class="hand-indicator-center">
                    <div id="target-char-display" class="target-bubble">
                        <span class="target-char">␣</span>
                        <span class="target-finger-name">Left Index</span>
                    </div>
                </div>

                <div class="hand-container right-hand">
                    <div class="hand-label">Right Hand</div>
                    <div class="hand-fingers-svg">
                        <svg viewBox="0 0 200 160" class="hand-svg">
                            <!-- Palm Base -->
                            <path class="palm" d="M40,90 Q40,150 100,150 Q160,150 160,90 Q160,70 140,60 L140,110 L60,110 L40,90 Z" fill="rgba(255,255,255,0.08)" stroke="currentColor" stroke-width="2" transform="scale(-1, 1) translate(-200, 0)"/>
                            <!-- Thumb -->
                            <rect id="f-right-thumb" class="finger-pill thumb" x="25" y="80" width="22" height="50" rx="11" transform="rotate(-35 25 80)" />
                            <!-- Index -->
                            <rect id="f-right-index" class="finger-pill" x="50" y="28" width="22" height="72" rx="11" />
                            <!-- Middle -->
                            <rect id="f-right-middle" class="finger-pill" x="80" y="15" width="24" height="85" rx="12" />
                            <!-- Ring -->
                            <rect id="f-right-ring" class="finger-pill" x="112" y="25" width="22" height="75" rx="11" />
                            <!-- Pinky -->
                            <rect id="f-right-pinky" class="finger-pill" x="144" y="45" width="20" height="55" rx="10" />
                        </svg>
                        <div class="finger-names-row">
                            <span class="fname text-thumb">Thumb</span>
                            <span class="fname text-index">Index</span>
                            <span class="fname text-middle">Mid</span>
                            <span class="fname text-ring">Ring</span>
                            <span class="fname text-pinky">Pinky</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    highlightTarget(char) {
        // Clear past highlights
        document.querySelectorAll('.key-cap.is-target, .key-cap.is-shift-target').forEach(el => {
            el.classList.remove('is-target', 'is-shift-target');
        });
        document.querySelectorAll('.finger-pill.active').forEach(el => {
            el.classList.remove('active');
        });

        if (!char) return;

        let fingerCode = this.keyToFinger[char] || this.keyToFinger[char.toLowerCase()];
        const isUpperCase = char !== ' ' && char.toUpperCase() === char && char.toLowerCase() !== char;
        const requiresShift = isUpperCase || '~!@#$%^&*()_+{}|:"<>?'.includes(char);

        // Target key element
        let targetKeyEl = null;
        if (char === ' ') {
            targetKeyEl = this.container.querySelector('[data-code="Space"]');
            fingerCode = 'th';
        } else {
            // Find key by character or shift
            const lower = char.toLowerCase();
            targetKeyEl = this.container.querySelector(`[data-key="${lower}"]`) ||
                          this.container.querySelector(`[data-shift="${char}"]`);
        }

        if (targetKeyEl) {
            targetKeyEl.classList.add('is-target');
        }

        // If shift is needed, highlight opposite shift key
        if (requiresShift) {
            const isLeftHandKey = ['lp', 'lr', 'lm', 'li'].includes(fingerCode);
            const shiftCode = isLeftHandKey ? 'ShiftRight' : 'ShiftLeft';
            const shiftEl = this.container.querySelector(`[data-code="${shiftCode}"]`);
            if (shiftEl) {
                shiftEl.classList.add('is-shift-target');
            }
            // Also light up the opposite pinky
            const oppositePinkyId = isLeftHandKey ? 'f-right-pinky' : 'f-left-pinky';
            const oppFingerEl = document.getElementById(oppositePinkyId);
            if (oppFingerEl) oppFingerEl.classList.add('active');
        }

        // Light up primary finger
        if (fingerCode) {
            const fingerInfo = this.fingerMap[fingerCode];
            let fingerElId = '';
            if (fingerCode === 'th') {
                fingerElId = 'f-right-thumb'; // Default thumb
            } else {
                fingerElId = `f-${fingerInfo.hand}-${fingerInfo.finger}`;
            }

            const fingerEl = document.getElementById(fingerElId);
            if (fingerEl) fingerEl.classList.add('active');

            // Update Target Bubble
            const bubbleChar = document.querySelector('.target-bubble .target-char');
            const bubbleFinger = document.querySelector('.target-bubble .target-finger-name');
            if (bubbleChar && bubbleFinger) {
                bubbleChar.textContent = char === ' ' ? 'Space' : char;
                bubbleFinger.textContent = fingerInfo.name + (requiresShift ? ' (+Shift)' : '');
                bubbleFinger.style.color = fingerInfo.color;
            }
        }
    }

    flashErrorKey(char) {
        if (!char) return;
        const lower = char.toLowerCase();
        const keyEl = this.container.querySelector(`[data-key="${lower}"]`) ||
                      this.container.querySelector(`[data-shift="${char}"]`) ||
                      (char === ' ' ? this.container.querySelector('[data-code="Space"]') : null);

        if (keyEl) {
            keyEl.classList.add('is-error');
            setTimeout(() => keyEl.classList.remove('is-error'), 250);
        }
    }

    pressKey(code) {
        const keyEl = this.container.querySelector(`[data-code="${code}"]`);
        if (keyEl) {
            keyEl.classList.add('is-pressed');
        }
    }

    releaseKey(code) {
        const keyEl = this.container.querySelector(`[data-code="${code}"]`);
        if (keyEl) {
            keyEl.classList.remove('is-pressed');
        }
    }
}

window.KeyboardVisualizer = KeyboardVisualizer;
