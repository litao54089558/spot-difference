// Spot the Difference — sound effects, made, not shipped.
// One job: turn game events into short WebAudio tones. No audio files are
// loaded or stored; every sound is an oscillator shaped in code, so the
// game stays offline and the dossier lists no audio assets.

let audioContext = null;

function getAudioContext() {
  if (audioContext) return audioContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext = new AudioContextClass();
  return audioContext;
}

function playTone({ frequency, frequencyEnd, durationMs, type, volume }) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (frequencyEnd !== undefined) {
    oscillator.frequency.exponentialRampToValueAtTime(frequencyEnd, now + durationMs / 1000);
  }
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000 + 0.02);
}

// A bright two-note pop when a difference is found.
export function playFindSound(muted) {
  if (muted) return;
  playTone({ frequency: 660, durationMs: 90, type: 'sine', volume: 0.25 });
  setTimeout(() => playTone({ frequency: 990, durationMs: 140, type: 'sine', volume: 0.22 }), 70);
}

// A low buzz when a click misses.
export function playMissSound(muted) {
  if (muted) return;
  playTone({ frequency: 180, frequencyEnd: 120, durationMs: 180, type: 'sawtooth', volume: 0.12 });
}

// A soft chime when a hint is used.
export function playHintSound(muted) {
  if (muted) return;
  playTone({ frequency: 880, durationMs: 120, type: 'triangle', volume: 0.18 });
}

// A little rising fanfare when a level is cleared.
export function playLevelClearSound(muted) {
  if (muted) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((frequency, i) => {
    setTimeout(() => playTone({ frequency, durationMs: 160, type: 'triangle', volume: 0.2 }), i * 110);
  });
}

// A falling phrase when time runs out.
export function playGameOverSound(muted) {
  if (muted) return;
  const notes = [392, 330, 262];
  notes.forEach((frequency, i) => {
    setTimeout(() => playTone({ frequency, durationMs: 220, type: 'triangle', volume: 0.18 }), i * 160);
  });
}
