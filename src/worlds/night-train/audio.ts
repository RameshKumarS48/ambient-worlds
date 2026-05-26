import type { WorldAudioEngine } from "../registry";

export function nightTrainAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let rumbleGain: GainNode | null = null;
  let clackInterval: ReturnType<typeof setInterval> | null = null;
  let trainSpeed = 0.6;
  let dest: AudioNode | null = null;

  function makeWhiteNoise(audioCtx: AudioContext, secs = 20): AudioBufferSourceNode {
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * secs, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    return src;
  }

  function startClacking() {
    if (!ctx || !dest) return;
    if (clackInterval) clearInterval(clackInterval);
    clackInterval = setInterval(() => {
      if (!ctx || !dest) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 90 + Math.random() * 60;
      osc.type = "sawtooth";
      osc.connect(g);
      g.connect(dest);
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }, Math.max(200, 900 / trainSpeed));
  }

  return {
    start(audioCtx: AudioContext) {
      ctx = audioCtx;
      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      dest = master;

      const rumbleOsc = ctx.createOscillator();
      rumbleOsc.frequency.value = 55;
      rumbleOsc.type = "sawtooth";
      rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.18;
      const rumbleFilter = ctx.createBiquadFilter();
      rumbleFilter.type = "lowpass";
      rumbleFilter.frequency.value = 180;
      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(master);
      rumbleOsc.start();

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.25;
      const panner = ctx.createStereoPanner();
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.6;
      lfo.connect(lfoGain);
      lfoGain.connect(panner.pan);
      lfo.start();

      const wind = makeWhiteNoise(ctx);
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "bandpass";
      windFilter.frequency.value = 700;
      windFilter.Q.value = 1.5;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.04;
      wind.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(panner);
      panner.connect(master);
      wind.start();

      startClacking();
    },
    stop() {
      if (clackInterval) clearInterval(clackInterval);
      rumbleGain?.disconnect();
      ctx = null;
    },
    setParam(key: string, value: number | boolean) {
      if (!ctx) return;
      if (key === "trainSpeed" && typeof value === "number") {
        trainSpeed = value;
        if (rumbleGain) {
          rumbleGain.gain.setTargetAtTime(0.1 + value * 0.15, ctx.currentTime, 0.4);
        }
        startClacking();
      }
    },
  };
}
