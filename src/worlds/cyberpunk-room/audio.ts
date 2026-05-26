import type { WorldAudioEngine } from "../registry";

function whiteNoise(ctx: AudioContext, secs = 15): AudioBufferSourceNode {
  const buf = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
}

export function cyberpunkRoomAudio(): WorldAudioEngine {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let rainGain: GainNode | null = null;
  let neonGain: GainNode | null = null;
  let active = false;
  let keyboardTimer: ReturnType<typeof setTimeout> | null = null;

  function scheduleKeyClack(ac: AudioContext, dest: AudioNode) {
    if (!active) return;
    const delay = 200 + Math.random() * 800;
    keyboardTimer = setTimeout(() => {
      if (!active || !ctx) return;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const f = ac.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 2200 + Math.random() * 600; f.Q.value = 8;
      osc.type = "square"; osc.frequency.value = 1800 + Math.random() * 400;
      osc.connect(f); f.connect(g); g.connect(dest);
      g.gain.setValueAtTime(0, ac.currentTime);
      g.gain.linearRampToValueAtTime(0.035, ac.currentTime + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
      osc.start(); osc.stop(ac.currentTime + 0.06);
      scheduleKeyClack(ac, dest);
    }, delay);
  }

  return {
    start(ac) {
      ctx = ac;
      active = true;
      masterGain = ac.createGain(); masterGain.gain.value = 0.9;
      masterGain.connect(ac.destination);

      // Rain on window — white noise bandpass + LP
      const rain = whiteNoise(ac, 12);
      const rainLP = ac.createBiquadFilter(); rainLP.type = "lowpass"; rainLP.frequency.value = 1100;
      const rainBP = ac.createBiquadFilter(); rainBP.type = "bandpass"; rainBP.frequency.value = 600; rainBP.Q.value = 0.5;
      rainGain = ac.createGain(); rainGain.gain.value = 0.22;
      rain.connect(rainLP); rainLP.connect(rainBP); rainBP.connect(rainGain); rainGain.connect(masterGain);
      rain.start();

      // Neon sign electrical buzz — two detuned oscillators through HP
      const buzz1 = ac.createOscillator(); buzz1.type = "sawtooth"; buzz1.frequency.value = 120;
      const buzz2 = ac.createOscillator(); buzz2.type = "sawtooth"; buzz2.frequency.value = 121.5;
      const buzzFilt = ac.createBiquadFilter(); buzzFilt.type = "bandpass"; buzzFilt.frequency.value = 240; buzzFilt.Q.value = 2;
      neonGain = ac.createGain(); neonGain.gain.value = 0.04;
      buzz1.connect(buzzFilt); buzz2.connect(buzzFilt); buzzFilt.connect(neonGain); neonGain.connect(masterGain);
      buzz1.start(); buzz2.start();

      // Deep city bass hum
      const cityOsc = ac.createOscillator(); cityOsc.type = "sine"; cityOsc.frequency.value = 55;
      const cityFilt = ac.createBiquadFilter(); cityFilt.type = "lowpass"; cityFilt.frequency.value = 90;
      const cityGain = ac.createGain(); cityGain.gain.value = 0.05;
      cityOsc.connect(cityFilt); cityFilt.connect(cityGain); cityGain.connect(masterGain);
      cityOsc.start();

      // Computer fan — white noise HP
      const fan = whiteNoise(ac, 10);
      const fanFilt = ac.createBiquadFilter(); fanFilt.type = "highpass"; fanFilt.frequency.value = 800;
      const fanLP = ac.createBiquadFilter(); fanLP.type = "lowpass"; fanLP.frequency.value = 2400;
      const fanGain = ac.createGain(); fanGain.gain.value = 0.03;
      fan.connect(fanFilt); fanFilt.connect(fanLP); fanLP.connect(fanGain); fanGain.connect(masterGain);
      fan.start();

      // Keyboard typing
      scheduleKeyClack(ac, masterGain);
    },
    stop() {
      active = false;
      if (keyboardTimer) clearTimeout(keyboardTimer);
      masterGain?.disconnect();
      ctx = null;
    },
    setParam(key, value) {
      if (!ctx) return;
      if (key === "rainIntensity" && rainGain) {
        rainGain.gain.setTargetAtTime((value as number) * 0.35, ctx.currentTime, 0.4);
      }
      if (key === "neonOn" && neonGain) {
        neonGain.gain.setTargetAtTime(value ? 0.04 : 0.001, ctx.currentTime, 0.2);
      }
      if (key === "ambientVolume" && masterGain) {
        masterGain.gain.setTargetAtTime(value as number, ctx.currentTime, 0.3);
      }
    },
  };
}
