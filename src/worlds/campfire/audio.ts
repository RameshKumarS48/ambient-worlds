import type { WorldAudioEngine } from "../registry";

function brownNoise(ctx: AudioContext, secs = 20): AudioBufferSourceNode {
  const buf = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    d[i] = (last + 0.02 * w) / 1.02;
    last = d[i];
    d[i] *= 3.5;
  }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
}

function whiteNoise(ctx: AudioContext, secs = 15): AudioBufferSourceNode {
  const buf = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
}

export function campfireAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let fireGain: GainNode | null = null;
  let windGain: GainNode | null = null;
  let active = false;
  let crackleTimer: ReturnType<typeof setTimeout> | null = null;
  let cricketTimer: ReturnType<typeof setInterval> | null = null;

  function scheduleCrackle(ac: AudioContext, dest: AudioNode) {
    if (!active) return;
    const delay = 600 + Math.random() * 2500;
    crackleTimer = setTimeout(() => {
      if (!active || !ctx) return;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const f = ac.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 800 + Math.random() * 1200; f.Q.value = 6;
      osc.type = "sawtooth"; osc.frequency.value = 600 + Math.random() * 300;
      osc.connect(f); f.connect(g); g.connect(dest);
      const now = ac.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.07 + Math.random() * 0.05, now + 0.006);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + Math.random() * 0.12);
      osc.start(); osc.stop(now + 0.22);
      scheduleCrackle(ac, dest);
    }, delay);
  }

  function startCrickets(ac: AudioContext, dest: AudioNode) {
    const chirp = () => {
      if (!active || !ctx) return;
      // Each cricket is two fast oscillator bursts
      [0, 0.05].forEach(offset => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = "sine"; osc.frequency.value = 3800 + Math.random() * 400;
        osc.connect(g); g.connect(dest);
        const t = ac.currentTime + offset;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.025, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.start(t); osc.stop(t + 0.06);
      });
    };
    cricketTimer = setInterval(chirp, 280 + Math.random() * 200);
  }

  return {
    start(ac) {
      ctx = ac;
      active = true;
      masterGain = ac.createGain(); masterGain.gain.value = 0.9;
      masterGain.connect(ac.destination);

      // Fire core — brown noise through mid bandpass
      const fire = brownNoise(ac);
      const fireFiltLow = ac.createBiquadFilter(); fireFiltLow.type = "lowpass"; fireFiltLow.frequency.value = 1600;
      const fireFiltHigh = ac.createBiquadFilter(); fireFiltHigh.type = "highpass"; fireFiltHigh.frequency.value = 180;
      fireGain = ac.createGain(); fireGain.gain.value = 0.32;
      fire.connect(fireFiltHigh); fireFiltHigh.connect(fireFiltLow); fireFiltLow.connect(fireGain); fireGain.connect(masterGain);
      fire.start();

      // Wind — white noise bandpass, slow LFO modulated
      const wind = whiteNoise(ac, 18);
      const windFilt = ac.createBiquadFilter(); windFilt.type = "bandpass"; windFilt.frequency.value = 400; windFilt.Q.value = 0.4;
      windGain = ac.createGain(); windGain.gain.value = 0;
      wind.connect(windFilt); windFilt.connect(windGain); windGain.connect(masterGain);
      wind.start();

      // Deep fire rumble
      const rumble = ac.createOscillator(); rumble.type = "sine"; rumble.frequency.value = 55;
      const rumbleFilt = ac.createBiquadFilter(); rumbleFilt.type = "lowpass"; rumbleFilt.frequency.value = 100;
      const rumbleGain = ac.createGain(); rumbleGain.gain.value = 0.04;
      rumble.connect(rumbleFilt); rumbleFilt.connect(rumbleGain); rumbleGain.connect(masterGain);
      rumble.start();

      // Wood crackles
      scheduleCrackle(ac, masterGain);

      // Crickets
      startCrickets(ac, masterGain);
    },
    stop() {
      active = false;
      if (crackleTimer) clearTimeout(crackleTimer);
      if (cricketTimer) clearInterval(cricketTimer);
      masterGain?.disconnect();
      ctx = null;
    },
    setParam(key, value) {
      if (!ctx) return;
      if (key === "fireIntensity" && fireGain) {
        fireGain.gain.setTargetAtTime((value as number) * 0.42, ctx.currentTime, 0.5);
      }
      if (key === "windowOpen" && windGain) {
        windGain.gain.setTargetAtTime(value ? 0.14 : 0, ctx.currentTime, 0.8);
      }
      if (key === "ambientVolume" && masterGain) {
        masterGain.gain.setTargetAtTime(value as number, ctx.currentTime, 0.3);
      }
    },
  };
}
