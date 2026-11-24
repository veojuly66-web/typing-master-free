// Web Audio API synthesizer for realistic typing sounds, piano notes, and game SFX
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.soundPack = 'piano'; // Default to 'piano' as requested!
    this.volume = 0.45;
    this.initFromStorage();
  }

  initFromStorage() {
    try {
      const saved = localStorage.getItem('typing_master_sound');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.enabled = parsed.enabled ?? true;
        this.soundPack = parsed.soundPack || 'piano';
        this.volume = parsed.volume ?? 0.45;
      }
    } catch (e) {
      console.error(e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('typing_master_sound', JSON.stringify({
        enabled: this.enabled,
        soundPack: this.soundPack,
        volume: this.volume
      }));
    } catch (e) {
      console.error(e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getPianoFreq(char) {
    if (!char) return 261.63; // C4
    const c = String(char).toLowerCase();
    const map = {
      // Lower Octave / Number Row
      '1': 130.81, '2': 146.83, '3': 164.81, '4': 174.61, '5': 196.00,
      '6': 220.00, '7': 246.94, '8': 261.63, '9': 293.66, '0': 329.63,
      '-': 349.23, '=': 392.00,
      
      // Bottom Row
      'z': 174.61, // F3
      'x': 196.00, // G3
      'c': 220.00, // A3
      'v': 246.94, // B3
      'b': 261.63, // C4
      'n': 293.66, // D4
      'm': 329.63, // E4
      ',': 349.23, // F4
      '.': 392.00, // G4
      '/': 440.00, // A4

      // Home Row - Natural C Major / Melodic Diatonic Scale
      'a': 261.63, // C4 (Middle C)
      'w': 277.18, // C#4
      's': 293.66, // D4
      'e': 311.13, // D#4
      'd': 329.63, // E4
      'f': 349.23, // F4
      't': 369.99, // F#4
      'g': 392.00, // G4
      'y': 415.30, // G#4
      'h': 440.00, // A4
      'u': 466.16, // A#4
      'j': 493.88, // B4
      'k': 523.25, // C5
      'o': 554.37, // C#5
      'l': 587.33, // D5
      'p': 622.25, // D#5
      ';': 659.25, // E5
      '\'': 698.46, // F5

      // Top Row Higher Chimes
      'q': 392.00, 'r': 440.00, 'i': 523.25, '[': 783.99, ']': 880.00,

      // Special Keys
      ' ': 130.81, // C3 Deep Bass
      'space': 130.81,
      'enter': 523.25, // High C5 chime
      'backspace': 196.00 // Low G3
    };

    if (map[c]) return map[c];
    
    // Musical scale fallback based on character code
    const code = c.charCodeAt(0);
    return 220 * Math.pow(2, ((code * 7) % 24) / 12);
  }

  playPianoNote(char) {
    const freq = this.getPianoFreq(char);
    const now = this.ctx.currentTime;
    const duration = 0.95; // realistic rich acoustic piano sustain

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.95, now);
    masterGain.connect(this.ctx.destination);

    // 1. Fundamental Harmonic (Warm Sine)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.75, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + duration);

    // 2. Second Harmonic (Rich Octave Resonance)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.65);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now);
    osc2.stop(now + duration * 0.65);

    // 3. Third Harmonic (Acoustic Sparkle)
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.12, now + 0.004);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.35);
    osc3.connect(gain3);
    gain3.connect(masterGain);
    osc3.start(now);
    osc3.stop(now + duration * 0.35);

    // 4. Subtle Piano Felt Hammer Knock
    const knockOsc = this.ctx.createOscillator();
    const knockGain = this.ctx.createGain();
    knockOsc.type = 'sine';
    knockOsc.frequency.setValueAtTime(150, now);
    knockOsc.frequency.exponentialRampToValueAtTime(30, now + 0.02);
    knockGain.gain.setValueAtTime(0.2, now);
    knockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    knockOsc.connect(knockGain);
    knockGain.connect(masterGain);
    knockOsc.start(now);
    knockOsc.stop(now + 0.03);
  }

  playKeypress(charOrSpecial = null, isSpecial = false) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    if (this.soundPack === 'piano') {
      this.playPianoNote(typeof charOrSpecial === 'string' ? charOrSpecial : (isSpecial ? 'space' : 'a'));
      return;
    }

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    if (this.soundPack === 'typewriter') {
      // Typewriter sharp metal strike + resonant click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isSpecial ? 380 : 540 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      // Noise click
      const bufferSize = this.ctx.sampleRate * 0.015;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1800;
      noise.connect(noiseFilter);
      noiseFilter.connect(masterGain);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.05);

    } else if (this.soundPack === 'soft') {
      // Soft gentle pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSpecial ? 320 : 420 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.03);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.04);

    } else {
      // Mechanical switch "thock"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = isSpecial ? 160 : 210 + Math.random() * 30;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      // Click snap
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(750, now);
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.015);
      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(masterGain);
      gain2.connect(masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.06);
      osc2.stop(now + 0.02);
    }
  }

  playError() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(130, now + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + idx * 0.07;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.5, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  playBubblePop() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 400, now + 0.07);

    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playLaser() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const soundManager = new SoundManager();
