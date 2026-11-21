// Tiny synthesized sound effects (Web Audio), so there is no audio file to download.
// Browsers only allow audio after a user gesture, so call these from click handlers.

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** A soft, airy paper swish for flipping a polaroid to the back of the pile. */
export function playFlip() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;

  if (!noise) {
    noise = c.createBuffer(1, Math.floor(c.sampleRate * 0.4), c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = noise;
  // two stacked filters keep only a gentle, breathy band: no hard click, no low thump
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1800;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(3000, t);
  lp.frequency.linearRampToValueAtTime(6500, t + 0.3);
  const gain = c.createGain();
  // slow attack and long, soft tail (a slap has a fast attack)
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.07, t + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
  src.connect(hp).connect(lp).connect(gain).connect(c.destination);
  src.start(t);
  src.stop(t + 0.36);
}
