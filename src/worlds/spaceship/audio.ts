import type { WorldAudioEngine } from "../registry";

function whiteNoise(ctx: AudioContext, secs = 20): AudioBufferSourceNode {
  const buf = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
}

export function spaceshipAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let engineGain: GainNode | null = null;
  let holoGain: GainNode | null = null;
  let active = false;
  let beepTimer: ReturnType<typeof setTimeout> | null = null;

  function scheduleBeep(ac: AudioContext, dest: AudioNode) {
    if (!active) return;
    const delay = 3000 + Math.random() * 9000;
    beepTimer = setTimeout(() => {
      if (!active || !ctx) return;
      const freq = [440, 660, 880, 1100][Math.floor(Math.random() * 4)];
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "sine"; osc.frequency.value = freq;
      osc.connect(g); g.connect(dest);
      const now = ac.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.04, now + 0.01);
      g.gain.setValueAtTime(0.04, now + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now); osc.stop(now + 0.25);
      // Sometimes double beep
      if (Math.random() > 0.6) {
        const osc2 = ac.createOscillator();
        const g2 = ac.createGain();
        osc2.type = "sine"; osc2.frequency.value = freq * 1.5;
        osc2.connect(g2); g2.connect(dest);
        g2.gain.setValueAtTime(0, now + 0.15);
        g2.gain.linearRampToValueAtTime(0.03, now + 0.16);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc2.start(now + 0.15); osc2.stop(now + 0.3);
      }
      scheduleBeep(ac, dest);
    }, delay);
  }

  return {
    start(ac) {
      ctx = ac;
      active = true;
      masterGain = ac.createGain(); masterGain.gain.value = 0.85;
      masterGain.connect(ac.destination);

      // Main engine drone — two detuned low sines + white noise through HP
      const eng1 = ac.createOscillator(); eng1.type = "sawtooth"; eng1.frequency.value = 68;
      const eng2 = ac.createOscillator(); eng2.type = "sawtooth"; eng2.frequency.value = 71;
      const engFilt = ac.createBiquadFilter(); engFilt.type = "lowpass"; engFilt.frequency.value = 200;
      engineGain = ac.createGain(); engineGain.gain.value = 0.18;
      eng1.connect(engFilt); eng2.connect(engFilt); engFilt.connect(engineGain); engineGain.connect(masterGain);
      eng1.start(); eng2.start();

      // Air recycler — white noise bandpass
      const airNoise = whiteNoise(ac);
      const airFilt = ac.createBiquadFilter(); airFilt.type = "bandpass"; airFilt.frequency.value = 900; airFilt.Q.value = 1.2;
      const airGain = ac.createGain(); airGain.gain.value = 0.04;
      airNoise.connect(airFilt); airFilt.connect(airGain); airGain.connect(masterGain);
      airNoise.start();

      // High freq electronics hum
      const elec = ac.createOscillator(); elec.type = "sine"; elec.frequency.value = 3200;
      const elecGain = ac.createGain(); elecGain.gain.value = 0.008;
      elec.connect(elecGain); elecGain.connect(masterGain);
      elec.start();

      // Holographic display hum — holoActive
      const holoOsc = ac.createOscillator(); holoOsc.type = "sine"; holoOsc.frequency.value = 540;
      const holoFilt = ac.createBiquadFilter(); holoFilt.type = "bandpass"; holoFilt.frequency.value = 540; holoFilt.Q.value = 3;
      holoGain = ac.createGain(); holoGain.gain.value = 0.02;
      holoOsc.connect(holoFilt); holoFilt.connect(holoGain); holoGain.connect(masterGain);
      holoOsc.start();

      // Console beeps
      scheduleBeep(ac, masterGain);
    },
    stop() {
      active = false;
      if (beepTimer) clearTimeout(beepTimer);
      masterGain?.disconnect();
      ctx = null;
    },
    setParam(key, value) {
      if (!ctx) return;
      if (key === "holoActive" && holoGain) {
        holoGain.gain.setTargetAtTime(value ? 0.02 : 0.001, ctx.currentTime, 0.3);
      }
      if (key === "ambientVolume" && masterGain) {
        masterGain.gain.setTargetAtTime(value as number, ctx.currentTime, 0.3);
      }
    },
  };
}
