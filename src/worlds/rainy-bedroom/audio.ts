import type { WorldAudioEngine } from "../registry";

export function rainyBedroomAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let windowGain: GainNode | null = null;
  let drip: ReturnType<typeof scheduleDrips> | null = null;

  function makeNoise(audioCtx: AudioContext, durationSeconds = 30): AudioBufferSourceNode {
    const bufferSize = audioCtx.sampleRate * durationSeconds;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.11;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    return src;
  }

  function scheduleDrips(audioCtx: AudioContext, dest: AudioNode) {
    let active = true;
    function scheduleNext() {
      if (!active) return;
      const delay = 6000 + Math.random() * 14000;
      const t = setTimeout(() => {
        if (!active) return;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1800 + Math.random() * 600;
        filter.Q.value = 12;
        osc.frequency.value = 1600 + Math.random() * 400;
        osc.connect(filter);
        filter.connect(g);
        g.connect(dest);
        g.gain.setValueAtTime(0, audioCtx.currentTime);
        g.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
        scheduleNext();
      }, delay);
      return t;
    }
    scheduleNext();
    return { stop: () => { active = false; } };
  }

  return {
    start(audioCtx: AudioContext) {
      ctx = audioCtx;
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.22;
      masterGain.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;
      filter.connect(masterGain);

      const noise = makeNoise(ctx);
      noise.connect(filter);
      noise.start();

      windowGain = ctx.createGain();
      windowGain.gain.value = 0;
      const noiseFilter2 = ctx.createBiquadFilter();
      noiseFilter2.type = "bandpass";
      noiseFilter2.frequency.value = 1400;
      noiseFilter2.Q.value = 0.6;
      const noise2 = makeNoise(ctx, 15);
      noise2.connect(noiseFilter2);
      noiseFilter2.connect(windowGain);
      windowGain.connect(masterGain);
      noise2.start();

      drip = scheduleDrips(ctx, masterGain);
    },
    stop() {
      drip?.stop();
      masterGain?.disconnect();
      ctx = null;
    },
    setParam(key: string, value: number | boolean) {
      if (!ctx || !masterGain) return;
      if (key === "rainIntensity" && typeof value === "number") {
        masterGain.gain.setTargetAtTime(value * 0.35, ctx.currentTime, 0.3);
      }
      if (key === "windowOpen" && windowGain) {
        windowGain.gain.setTargetAtTime(value ? 0.15 : 0, ctx.currentTime, 0.5);
      }
    },
  };
}
