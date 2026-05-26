import type { WorldAudioEngine } from "../registry";

export function cozyCafeAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let teaGain: GainNode | null = null;
  let fanOsc: OscillatorNode | null = null;
  let fanGain: GainNode | null = null;
  let radioNoiseGain: GainNode | null = null;
  let radioToneGain: GainNode | null = null;

  function makeBrownNoise(audioCtx: AudioContext, secs = 25): AudioBufferSourceNode {
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * secs, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < d.length; i++) {
      const white = Math.random() * 2 - 1;
      d[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = d[i];
      d[i] *= 3.5;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    return src;
  }

  return {
    start(audioCtx: AudioContext) {
      ctx = audioCtx;
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.45;
      masterGain.connect(ctx.destination);

      // Crowd murmur: 5 slightly detuned sine oscillators
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 150 + i * 55 + Math.random() * 30;
        lfo.frequency.value = 0.2 + Math.random() * 0.3;
        lfoG.gain.value = 8;
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        g.gain.value = 0.018 + Math.random() * 0.012;
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        lfo.start();
      }

      // Ambient hiss undertone
      const brownNoise = makeBrownNoise(ctx);
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 400;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.06;
      brownNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      brownNoise.start();

      // Tea boil sound (highpass noise, initially silent)
      teaGain = ctx.createGain();
      teaGain.gain.value = 0;
      const teaNoise = makeBrownNoise(ctx, 10);
      const teaFilter = ctx.createBiquadFilter();
      teaFilter.type = "highpass";
      teaFilter.frequency.value = 1400;
      teaNoise.connect(teaFilter);
      teaFilter.connect(teaGain);
      teaGain.connect(masterGain);
      teaNoise.start();

      // Ceiling fan: low triangle hum
      fanOsc = ctx.createOscillator();
      fanOsc.type = "triangle";
      fanOsc.frequency.value = 4;
      fanGain = ctx.createGain();
      fanGain.gain.value = 0.025;
      fanOsc.connect(fanGain);
      fanGain.connect(masterGain);
      fanOsc.start();

      // Radio: tone + noise mixed by static level
      radioToneGain = ctx.createGain();
      radioToneGain.gain.value = 0.06;
      const radioOsc = ctx.createOscillator();
      radioOsc.frequency.value = 440;
      radioOsc.type = "sine";
      const radioOsc2 = ctx.createOscillator();
      radioOsc2.frequency.value = 523;
      radioOsc2.type = "sine";
      radioOsc.connect(radioToneGain);
      radioOsc2.connect(radioToneGain);
      radioToneGain.connect(masterGain);
      radioOsc.start();
      radioOsc2.start();

      radioNoiseGain = ctx.createGain();
      radioNoiseGain.gain.value = 0.012;
      const radioBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 10, audioCtx.sampleRate);
      const rd = radioBuf.getChannelData(0);
      for (let i = 0; i < rd.length; i++) rd[i] = Math.random() * 2 - 1;
      const radioNoiseSrc = audioCtx.createBufferSource();
      radioNoiseSrc.buffer = radioBuf;
      radioNoiseSrc.loop = true;
      const radioNoiseFilter = ctx.createBiquadFilter();
      radioNoiseFilter.type = "bandpass";
      radioNoiseFilter.frequency.value = 2000;
      radioNoiseFilter.Q.value = 0.8;
      radioNoiseSrc.connect(radioNoiseFilter);
      radioNoiseFilter.connect(radioNoiseGain);
      radioNoiseGain.connect(masterGain);
      radioNoiseSrc.start();
    },
    stop() {
      masterGain?.disconnect();
      ctx = null;
    },
    setParam(key: string, value: number | boolean) {
      if (!ctx) return;
      if (key === "teaReady" && teaGain) {
        teaGain.gain.setTargetAtTime(value ? 0.1 : 0, ctx.currentTime, 0.8);
      }
      if (key === "fanOn" && fanGain) {
        fanGain.gain.setTargetAtTime(value ? 0.025 : 0, ctx.currentTime, 0.3);
      }
      if (key === "radioStatic" && typeof value === "number") {
        if (radioNoiseGain) radioNoiseGain.gain.setTargetAtTime(value * 0.04, ctx.currentTime, 0.2);
        if (radioToneGain) radioToneGain.gain.setTargetAtTime((1 - value) * 0.06, ctx.currentTime, 0.2);
      }
    },
  };
}
