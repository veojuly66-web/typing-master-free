/**
 * Audio Synthesizer for Typing Master Free
 * Generates realistic mechanical keyboard switches, typewriter sounds,
 * error beeps, and celebration fanfares using the Web Audio API.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.soundType = 'mechanical'; // 'mechanical' | 'thock' | 'typewriter' | 'off'
        this.volume = 0.5;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setSoundType(type) {
        this.soundType = type;
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
    }

    playKeySound() {
        if (this.muted || this.soundType === 'off') return;
        this.init();
        if (!this.ctx) return;

        switch (this.soundType) {
            case 'mechanical':
                this.playMechanicalClick();
                break;
            case 'thock':
                this.playThockSound();
                break;
            case 'typewriter':
                this.playTypewriterClack();
                break;
        }
    }

    playMechanicalClick() {
        const now = this.ctx.currentTime;
        // High click impulse
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400 + Math.random() * 300, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);

        // Subtle bottom-out thump
        const thump = this.ctx.createOscillator();
        const thumpGain = this.ctx.createGain();
        thump.type = 'sine';
        thump.frequency.setValueAtTime(180 + Math.random() * 30, now);
        thump.frequency.exponentialRampToValueAtTime(60, now + 0.03);

        thumpGain.gain.setValueAtTime(this.volume * 0.35, now);
        thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        thump.connect(thumpGain);
        thumpGain.connect(this.ctx.destination);

        thump.start(now);
        thump.stop(now + 0.045);
    }

    playThockSound() {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220 + Math.random() * 20, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        gain.gain.setValueAtTime(this.volume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.065);
    }

    playTypewriterClack() {
        const now = this.ctx.currentTime;
        // Metallic snap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.setValueAtTime(2800 + Math.random() * 500, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1500, now);

        gain.gain.setValueAtTime(this.volume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
    }

    playErrorSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    playSuccessChime() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.volume * 0.4, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.45);
        });
    }

    playExplosionSound() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // White noise burst for word pop
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.2);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.2);
    }
}

window.soundEngine = new SoundEngine();
