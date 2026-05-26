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

export function quietLibraryAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let pageTurnTimer: ReturnType<typeof setTimeout> | null = null;
  let clockTimer: ReturnType<typeof setInterval> | null = null;
  let active = false;

  function schedulePageTurn(ac: AudioContext, dest: AudioNode) {
    if (!active) return;
    const delay = 8000 + Math.random() * 18000;
    pageTurnTimer = setTimeout(() => {
      if (!active || !ctx) return;
      // Paper rustle: high-freq filtered white noise burst
      const rustleLen = ac.sampleRate * 0.35;
      const rustleBuf = ac.createBuffer(1, rustleLen, ac.sampleRate);
      const rd = rustleBuf.getChannelData(0);
      for (let i = 0; i < rustleLen; i++) rd[i] = Math.random() * 2 - 1;
      const rsrc = ac.createBufferSource();
      rsrc.buffer = rustleBuf;
      const rg = ac.createGain();
      const rf = ac.createBiquadFilter();
      rf.type = "bandpass"; rf.frequency.value = 3500; rf.Q.value = 0.8;
      rsrc.connect(rf); rf.connect(rg); rg.connect(dest);
      rg.gain.setValueAtTime(0, ac.currentTime);
      rg.gain.linearRampToValueAtTime(0.09, ac.currentTime + 0.02);
      rg.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
      rsrc.start(); rsrc.stop(ac.currentTime + 0.38);
      schedulePageTurn(ac, dest);
    }, delay);
  }

  function startClock(ac: AudioContext, dest: AudioNode) {
    clockTimer = setInterval(() => {
      if (!active || !ac) return;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "sine"; osc.frequency.value = 1400 + Math.random() * 80;
      osc.connect(g); g.connect(dest);
      g.gain.setValueAtTime(0, ac.currentTime);
      g.gain.linearRampToValueAtTime(0.04, ac.currentTime + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
      osc.start(); osc.stop(ac.currentTime + 0.07);
    }, 1000);
  }

  return {
    start(ac) {
      ctx = ac;
      active = true;
      masterGain = ac.createGain(); masterGain.gain.value = 0.9;
      masterGain.connect(ac.destination);

      // Very soft HVAC/room hum — brown noise through tight LP
      const roomNoise = brownNoise(ac);
      const roomFilt = ac.createBiquadFilter(); roomFilt.type = "lowpass"; roomFilt.frequency.value = 220;
      const roomGain = ac.createGain(); roomGain.gain.value = 0.06;
      roomNoise.connect(roomFilt); roomFilt.connect(roomGain); roomGain.connect(masterGain);
      roomNoise.start();

      // Distant traffic — bandpass brown noise
      const trafficNoise = brownNoise(ac, 15);
      const trafficFilt = ac.createBiquadFilter(); trafficFilt.type = "bandpass"; trafficFilt.frequency.value = 380; trafficFilt.Q.value = 0.4;
      const trafficGain = ac.createGain(); trafficGain.gain.value = 0.04;
      trafficNoise.connect(trafficFilt); trafficFilt.connect(trafficGain); trafficGain.connect(masterGain);
      trafficNoise.start();

      // Clock ticks
      startClock(ac, masterGain);

      // Page turns
      schedulePageTurn(ac, masterGain);
    },
    stop() {
      active = false;
      if (pageTurnTimer) clearTimeout(pageTurnTimer);
      if (clockTimer) clearInterval(clockTimer);
      masterGain?.disconnect();
      ctx = null;
    },
    setParam(key, value) {
      if (!ctx || !masterGain) return;
      if (key === "ambientVolume") {
        masterGain.gain.setTargetAtTime(value as number, ctx.currentTime, 0.3);
      }
    },
  };
}
