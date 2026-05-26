import type { WorldAudioEngine } from "../registry";

function brownNoise(ctx: AudioContext, secs = 25): AudioBufferSourceNode {
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

export function rainyTokyoAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let rainGain: GainNode | null = null;
  let windowGain: GainNode | null = null;
  let cityGain: GainNode | null = null;
  let drips: { stop(): void } | null = null;

  function scheduleDrips(ac: AudioContext, dest: AudioNode) {
    let active = true;
    const go = () => {
      if (!active) return;
      const delay = 4000 + Math.random() * 10000;
      setTimeout(() => {
        if (!active) return;
        const osc = ac.createOscillator();
        const g = ac.createGain();
        const f = ac.createBiquadFilter();
        f.type = "bandpass"; f.frequency.value = 1600 + Math.random() * 800; f.Q.value = 14;
        osc.frequency.value = 1500 + Math.random() * 500;
        osc.connect(f); f.connect(g); g.connect(dest);
        g.gain.setValueAtTime(0, ac.currentTime);
        g.gain.linearRampToValueAtTime(0.06, ac.currentTime + 0.008);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);
        osc.start(); osc.stop(ac.currentTime + 0.25);
        go();
      }, delay);
    };
    go();
    return { stop() { active = false; } };
  }

  return {
    start(ac) {
      ctx = ac;
      masterGain = ac.createGain(); masterGain.gain.value = 1;
      masterGain.connect(ac.destination);

      // Main rain — layered brown noise through LP filter
      rainGain = ac.createGain(); rainGain.gain.value = 0.28;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
      const rain = brownNoise(ac);
      rain.connect(lp); lp.connect(rainGain); rainGain.connect(masterGain);
      rain.start();

      // Window open — higher pitched rain
      windowGain = ac.createGain(); windowGain.gain.value = 0;
      const lp2 = ac.createBiquadFilter(); lp2.type = "bandpass"; lp2.frequency.value = 1400; lp2.Q.value = 0.6;
      const rain2 = whiteNoise(ac, 12);
      rain2.connect(lp2); lp2.connect(windowGain); windowGain.connect(masterGain);
      rain2.start();

      // Distant city hum
      cityGain = ac.createGain(); cityGain.gain.value = 0.04;
      const city = ac.createOscillator(); city.type = "sawtooth"; city.frequency.value = 80;
      const cityFilt = ac.createBiquadFilter(); cityFilt.type = "lowpass"; cityFilt.frequency.value = 140;
      city.connect(cityFilt); cityFilt.connect(cityGain); cityGain.connect(masterGain);
      city.start();

      // Thunder rumble occasionally
      const rumble = ac.createOscillator(); rumble.type = "sine"; rumble.frequency.value = 42;
      const rumbleG = ac.createGain(); rumbleG.gain.value = 0.03;
      const rumbleFilt = ac.createBiquadFilter(); rumbleFilt.type = "lowpass"; rumbleFilt.frequency.value = 80;
      rumble.connect(rumbleFilt); rumbleFilt.connect(rumbleG); rumbleG.connect(masterGain);
      rumble.start();

      drips = scheduleDrips(ac, masterGain);
    },
    stop() {
      drips?.stop(); masterGain?.disconnect(); ctx = null;
    },
    setParam(key, value) {
      if (!ctx) return;
      if (key === "rainIntensity" && rainGain) {
        rainGain.gain.setTargetAtTime((value as number) * 0.38, ctx.currentTime, 0.4);
      }
      if (key === "windowOpen" && windowGain) {
        windowGain.gain.setTargetAtTime(value ? 0.18 : 0, ctx.currentTime, 0.6);
      }
      if (key === "ambientVolume") {
        masterGain?.gain.setTargetAtTime(value as number, ctx.currentTime, 0.3);
      }
    },
  };
}
