// js/Audio.js — Web Audio API sound engine

export class AudioEngine {
  constructor() {
    this._ctx     = null;
    this.enabled  = true;
    this._spinSrc = null;
  }

  // Must be called from a user gesture before any sound plays
  init() {
    if (this._ctx) return;
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  get ctx() { return this._ctx; }

  _connect(node) {
    node.connect(this._ctx.destination);
    return node;
  }

  _gain(vol, t = null) {
    const g = this._ctx.createGain();
    g.gain.value = vol;
    if (t != null) g.gain.exponentialRampToValueAtTime(0.0001, t);
    this._connect(g);
    return g;
  }

  _tone(freq, type, vol, start, end) {
    const osc = this._ctx.createOscillator();
    const g   = this._gain(vol, end);
    osc.type           = type;
    osc.frequency.value = freq;
    osc.connect(g);
    osc.start(start);
    osc.stop(end + 0.05);
  }

  click() {
    if (!this._ctx || !this.enabled) return;
    this._tone(880, 'square', 0.08, this._ctx.currentTime, this._ctx.currentTime + 0.05);
  }

  spin() {
    if (!this._ctx || !this.enabled) return;
    this.stopSpin();
    // White-noise whirl
    const rate    = this._ctx.sampleRate;
    const seconds = 4;
    const buf     = this._ctx.createBuffer(1, rate * seconds, rate);
    const data    = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.15;

    const src  = this._ctx.createBufferSource();
    const g    = this._ctx.createGain();
    const filt = this._ctx.createBiquadFilter();

    src.buffer = buf;
    filt.type  = 'bandpass';
    filt.frequency.value = 600;
    filt.Q.value         = 2;

    src.connect(filt);
    filt.connect(g);
    g.connect(this._ctx.destination);
    g.gain.setValueAtTime(0.25, this._ctx.currentTime);
    src.start();
    this._spinSrc  = src;
    this._spinGain = g;
  }

  stopSpin() {
    if (this._spinSrc) {
      try {
        this._spinGain.gain.exponentialRampToValueAtTime(0.0001, this._ctx.currentTime + 0.3);
        this._spinSrc.stop(this._ctx.currentTime + 0.31);
      } catch (_) {}
      this._spinSrc = null;
    }
  }

  reelStop(i) {
    if (!this._ctx || !this.enabled) return;
    const freqs = [392, 494, 587]; // G4, B4, D5
    const t = this._ctx.currentTime;
    this._tone(freqs[i], 'triangle', 0.25, t, t + 0.2);
  }

  win(multiplier) {
    if (!this._ctx || !this.enabled) return;
    const t = this._ctx.currentTime;
    const notes = multiplier >= 40
      ? [523, 659, 784, 1047, 1319, 1568] // jackpot fanfare
      : multiplier >= 10
        ? [523, 659, 784, 1047]
        : [523, 659, 784];
    notes.forEach((freq, i) => {
      this._tone(freq, 'sine', 0.3, t + i * 0.1, t + i * 0.1 + 0.3);
    });
  }

  lose() {
    if (!this._ctx || !this.enabled) return;
    const t = this._ctx.currentTime;
    this._tone(200, 'sawtooth', 0.12, t, t + 0.25);
  }

  rankUp() {
    if (!this._ctx || !this.enabled) return;
    const t = this._ctx.currentTime;
    [262, 330, 392, 494, 587, 740, 988, 1175].forEach((f, i) => {
      this._tone(f, 'sine', 0.25, t + i * 0.07, t + i * 0.07 + 0.22);
    });
  }
}
