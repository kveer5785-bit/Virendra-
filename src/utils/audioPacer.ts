/**
 * PulseFit Web Audio Cadence Metronome Engine
 * Synthesizes low-latency rhythmic cues for step pacing without external audio files.
 */

export class CadencePacerEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private tempoBpm = 115; // Steps per minute target
  private intervalId: number | null = null;
  private soundType: 'woodblock' | 'soft_chime' | 'subtle_click' = 'woodblock';
  private onBeatCallback: ((beatCount: number) => void) | null = null;
  private beatCounter = 0;

  constructor(initialTempo = 115) {
    this.tempoBpm = initialTempo;
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setTempo(bpm: number) {
    this.tempoBpm = Math.min(Math.max(bpm, 60), 220);
    if (this.isPlaying) {
      this.stop();
      this.start(this.onBeatCallback || undefined);
    }
  }

  public getTempo() {
    return this.tempoBpm;
  }

  public setSoundType(type: 'woodblock' | 'soft_chime' | 'subtle_click') {
    this.soundType = type;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  private playTone() {
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    if (this.soundType === 'woodblock') {
      // Crisp woody percussive tap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    } else if (this.soundType === 'soft_chime') {
      // Gentle aerobic chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6 note
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.09);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    } else {
      // Subtle dry tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    }

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public start(onBeat?: (count: number) => void) {
    this.initAudio();
    this.onBeatCallback = onBeat || null;
    this.isPlaying = true;

    const intervalMs = (60 / this.tempoBpm) * 1000;

    // Play first beat immediately
    this.playTone();
    this.beatCounter++;
    this.onBeatCallback?.(this.beatCounter);

    this.intervalId = window.setInterval(() => {
      this.playTone();
      this.beatCounter++;
      this.onBeatCallback?.(this.beatCounter);
    }, intervalMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
