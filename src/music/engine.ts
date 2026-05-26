import type { WorldId } from "@/worlds/registry";

// ── Note frequencies ──────────────────────────────────────────────────────────
const N: Record<string, number> = {
  C2:65.41,D2:73.42,E2:82.41,F2:87.31,G2:98.00,A2:110.00,Bb2:116.54,B2:123.47,
  C3:130.81,Db3:138.59,D3:146.83,Eb3:155.56,E3:164.81,F3:174.61,Gb3:185.00,G3:196.00,Ab3:207.65,A3:220.00,Bb3:233.08,B3:246.94,
  C4:261.63,Db4:277.18,D4:293.66,Eb4:311.13,E4:329.63,F4:349.23,Gb4:369.99,G4:392.00,Ab4:415.30,A4:440.00,Bb4:466.16,B4:493.88,
  C5:523.25,D5:587.33,Eb5:622.25,E5:659.25,F5:698.46,G5:783.99,Ab5:830.61,A5:880.00,Bb5:932.33,B5:987.77,
  C6:1046.50,D6:1174.66,E6:1318.51,
};

export interface MusicEngine {
  start(ctx: AudioContext, dest: AudioNode): void;
  stop(): void;
  setVolume(v: number): void;
}

// ── Reverb impulse response ───────────────────────────────────────────────────
function createReverb(ctx: AudioContext, dur = 2.5, decay = 2.2): ConvolverNode {
  const len = ctx.sampleRate * dur;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  const rev = ctx.createConvolver();
  rev.buffer = buf;
  return rev;
}

// ── Play a single piano note ──────────────────────────────────────────────────
function playNote(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  time: number,
  duration: number,
  gain = 0.08,
  type: OscillatorType = "triangle",
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1600 + Math.random() * 200;
  osc.type = type;
  osc.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.003); // slight humanize
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 0.012);
  g.gain.setTargetAtTime(gain * 0.6, time + 0.05, 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, time + duration);
  osc.connect(filter);
  filter.connect(g);
  g.connect(dest);
  osc.start(time);
  osc.stop(time + duration + 0.05);
}

// ── Vinyl crackle ─────────────────────────────────────────────────────────────
function createVinylCrackle(ctx: AudioContext, dest: AudioNode, gainVal = 0.015) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() > 0.998 ? (Math.random() - 0.5) * 0.8 : 0;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const g = ctx.createGain();
  g.gain.value = gainVal;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2000;
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  src.start();
  return src;
}

// ── World music configs ───────────────────────────────────────────────────────

type MusicConfig = {
  bpm: number;
  beatsPerChord: number;
  chords: Array<{ bass: number; voicing: number[]; label: string }>;
  noteType: OscillatorType;
  noteGain: number;
  bassGain: number;
  reverbMix: number;
  vinyl: boolean;
  arpeggiate: boolean;
  label: string;
};

const MUSIC_CONFIGS: Record<WorldId, MusicConfig> = {
  "rainy-tokyo": {
    bpm: 70, beatsPerChord: 4,
    chords: [
      { bass: N.D3,  voicing: [N.A3, N.C4, N.F4],  label: "Dm7" },
      { bass: N.G3,  voicing: [N.F4, N.B4, N.D5],  label: "G7" },
      { bass: N.C3,  voicing: [N.G4, N.B4, N.E5],  label: "Cmaj7" },
      { bass: N.A3,  voicing: [N.E4, N.G4, N.C5],  label: "Am7" },
      { bass: N.F3,  voicing: [N.A4, N.C5, N.E5],  label: "Fmaj7" },
      { bass: N.Bb3, voicing: [N.F4, N.A4, N.D5],  label: "Bb7" },
      { bass: N.Eb3, voicing: [N.G4, N.Bb4, N.D5], label: "Ebmaj7" },
      { bass: N.A3,  voicing: [N.E4, N.G4, N.C5],  label: "Am7" },
    ],
    noteType: "triangle", noteGain: 0.07, bassGain: 0.1,
    reverbMix: 0.35, vinyl: true, arpeggiate: false, label: "lo-fi afternoon",
  },
  "night-train": {
    bpm: 58, beatsPerChord: 5,
    chords: [
      { bass: N.Eb3, voicing: [N.G4, N.Bb4, N.D5],  label: "Ebmaj7" },
      { bass: N.C3,  voicing: [N.Eb4, N.G4, N.Bb4], label: "Cm7" },
      { bass: N.F3,  voicing: [N.Ab4, N.C5, N.Eb5], label: "Fm7" },
      { bass: N.Bb3, voicing: [N.D4, N.F4, N.Ab4],  label: "Bb7" },
      { bass: N.Eb3, voicing: [N.Bb4, N.D5, N.G5],  label: "Eb6" },
      { bass: N.Ab3, voicing: [N.C5, N.Eb5, N.G5],  label: "Abmaj7" },
    ],
    noteType: "triangle", noteGain: 0.065, bassGain: 0.09,
    reverbMix: 0.5, vinyl: true, arpeggiate: false, label: "midnight jazz",
  },
  "quiet-library": {
    bpm: 66, beatsPerChord: 4,
    chords: [
      { bass: N.C3,  voicing: [N.E4, N.G4, N.B4], label: "Cmaj7" },
      { bass: N.G3,  voicing: [N.D4, N.G4, N.B4], label: "G" },
      { bass: N.A3,  voicing: [N.E4, N.A4, N.C5], label: "Am" },
      { bass: N.F3,  voicing: [N.A4, N.C5, N.E5], label: "Fmaj7" },
      { bass: N.E3,  voicing: [N.G4, N.B4, N.D5], label: "Em7" },
      { bass: N.D3,  voicing: [N.F4, N.A4, N.C5], label: "Dm7" },
      { bass: N.G3,  voicing: [N.D4, N.F4, N.B4], label: "G7" },
      { bass: N.C3,  voicing: [N.E4, N.G4, N.C5], label: "C" },
    ],
    noteType: "sine", noteGain: 0.06, bassGain: 0.08,
    reverbMix: 0.55, vinyl: false, arpeggiate: false, label: "classical study",
  },
  "cyberpunk-room": {
    bpm: 95, beatsPerChord: 4,
    chords: [
      { bass: N.A2,  voicing: [N.A3, N.E4, N.G4],  label: "Am" },
      { bass: N.F2,  voicing: [N.F3, N.A3, N.C4],  label: "F" },
      { bass: N.C3,  voicing: [N.C4, N.E4, N.G4],  label: "C" },
      { bass: N.G2,  voicing: [N.G3, N.B3, N.D4],  label: "G" },
      { bass: N.A2,  voicing: [N.A3, N.C4, N.E4],  label: "Am" },
      { bass: N.Bb2, voicing: [N.Bb3, N.D4, N.F4], label: "Bb" },
    ],
    noteType: "sawtooth", noteGain: 0.045, bassGain: 0.08,
    reverbMix: 0.3, vinyl: false, arpeggiate: true, label: "synthwave drive",
  },
  "campfire": {
    bpm: 78, beatsPerChord: 4,
    chords: [
      { bass: N.G2,  voicing: [N.G3, N.B3, N.D4],  label: "G" },
      { bass: N.C3,  voicing: [N.C4, N.E4, N.G4],  label: "C" },
      { bass: N.D3,  voicing: [N.D4, N.Gb4, N.A4], label: "D" },
      { bass: N.E3,  voicing: [N.E4, N.G4, N.B4],  label: "Em" },
      { bass: N.G2,  voicing: [N.G3, N.B3, N.D4],  label: "G" },
      { bass: N.C3,  voicing: [N.E4, N.G4, N.C5],  label: "Cmaj" },
      { bass: N.D3,  voicing: [N.Gb4, N.A4, N.D5], label: "D" },
      { bass: N.G2,  voicing: [N.G4, N.B4, N.D5],  label: "G" },
    ],
    noteType: "triangle", noteGain: 0.065, bassGain: 0.09,
    reverbMix: 0.25, vinyl: false, arpeggiate: false, label: "acoustic embers",
  },
  "spaceship": {
    bpm: 45, beatsPerChord: 8,
    chords: [
      { bass: N.F2,  voicing: [N.F3, N.Ab3, N.C4],  label: "Fm" },
      { bass: N.Db3, voicing: [N.Ab3, N.C4, N.F4],  label: "Dbmaj7" },
      { bass: N.Ab2, voicing: [N.Eb3, N.G3, N.C4],  label: "Abmaj7" },
      { bass: N.Eb3, voicing: [N.Bb3, N.D4, N.G4],  label: "Ebmaj7" },
    ],
    noteType: "sine", noteGain: 0.055, bassGain: 0.07,
    reverbMix: 0.75, vinyl: false, arpeggiate: false, label: "deep space",
  },
};

// ── Create world music engine ──────────────────────────────────────────────────
export function createMusicEngine(worldId: WorldId): MusicEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let vinylSrc: AudioBufferSourceNode | null = null;
  let active = false;
  let chordIndex = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const config = MUSIC_CONFIGS[worldId];

  function scheduleChord(audioCtx: AudioContext, dest: AudioNode, time: number) {
    if (!active) return;
    const chord = config.chords[chordIndex % config.chords.length];
    const beatDuration = 60 / config.bpm;
    const chordDuration = beatDuration * config.beatsPerChord;
    const noteDuration = chordDuration * 0.85;

    // Bass note
    playNote(audioCtx, dest, chord.bass, time, noteDuration * 0.9, config.bassGain, "sine");

    if (config.arpeggiate) {
      // Arpeggio: stagger each voicing note
      chord.voicing.forEach((freq, i) => {
        playNote(audioCtx, dest, freq, time + i * (beatDuration * 0.25), noteDuration - i * beatDuration * 0.25, config.noteGain, config.noteType);
      });
    } else {
      // Block chord
      chord.voicing.forEach(freq => {
        playNote(audioCtx, dest, freq, time, noteDuration, config.noteGain, config.noteType);
      });
    }

    chordIndex++;
    const scheduleDelay = Math.max(10, (time + chordDuration - audioCtx.currentTime) * 1000 - 100);
    timeoutId = setTimeout(() => scheduleChord(audioCtx, dest, time + chordDuration), scheduleDelay);
  }

  return {
    start(audioCtx: AudioContext, dest: AudioNode) {
      ctx = audioCtx;
      active = true;
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.6;

      const reverb = createReverb(audioCtx, 2.5, 2.2);
      const dryGain = audioCtx.createGain();
      const wetGain = audioCtx.createGain();
      dryGain.gain.value = 1 - config.reverbMix;
      wetGain.gain.value = config.reverbMix;
      masterGain.connect(dryGain);
      masterGain.connect(reverb);
      reverb.connect(wetGain);
      dryGain.connect(dest);
      wetGain.connect(dest);

      if (config.vinyl) {
        vinylSrc = createVinylCrackle(audioCtx, dest);
      }

      scheduleChord(audioCtx, masterGain, audioCtx.currentTime + 0.1);
    },
    stop() {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
      vinylSrc?.stop();
      masterGain?.disconnect();
      ctx = null;
    },
    setVolume(v: number) {
      if (masterGain) masterGain.gain.setTargetAtTime(v, ctx!.currentTime, 0.3);
    },
  };
}

export function getMusicLabel(worldId: WorldId): string {
  return MUSIC_CONFIGS[worldId]?.label ?? "";
}
