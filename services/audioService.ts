
// Simple procedural audio synthesizer to avoid external assets
// Uses Web Audio API

let audioCtx: AudioContext | null = null;
let ambienceNode: AudioBufferSourceNode | null = null;
let ambienceGain: GainNode | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const createBrownNoise = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
    }
    return buffer;
};

export const startAmbience = () => {
    const ctx = getCtx();
    if (ambienceNode) return;
    if (ctx.state === 'suspended') ctx.resume();

    const buffer = createBrownNoise(ctx);
    ambienceNode = ctx.createBufferSource();
    ambienceNode.buffer = buffer;
    ambienceNode.loop = true;
    
    ambienceGain = ctx.createGain();
    ambienceGain.gain.value = 0.02; // Low rumble
    
    // Lowpass filter to make it sound like distant city/machinery
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    ambienceNode.connect(filter);
    filter.connect(ambienceGain);
    ambienceGain.connect(ctx.destination);
    
    ambienceNode.start();
};

export const stopAmbience = () => {
    if (ambienceNode) {
        ambienceNode.stop();
        ambienceNode = null;
    }
};

export const playSound = (type: 'BLIP' | 'TYPEWRITER' | 'ERROR' | 'SUCCESS' | 'AMBIENCE' | 'ELEVATOR' | 'FOOTSTEP' | 'ATTACK' | 'DAMAGE' | 'DOT' | 'DASH' | 'TELEGRAPH_SEND' | 'STEP_SNEAK' | 'ALERT') => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case 'BLIP': // Menu interaction
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
      
    case 'FOOTSTEP': // Smooth movement
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;

    case 'TYPEWRITER': // Text appearing
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
      break;

    case 'ERROR': // Bump/Invalid
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;

    case 'SUCCESS': // Action complete
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.1); // C#
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;

    case 'ATTACK': // Whoosh
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;

    case 'DAMAGE': // Crunch
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(20, now + 0.2);
      const osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(145, now);
      osc2.connect(gain);
      osc2.start(now);
      osc2.stop(now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    
    case 'ELEVATOR': 
       osc.type = 'square';
       osc.frequency.setValueAtTime(40, now);
       gain.gain.setValueAtTime(0.05, now);
       gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
       osc.start(now);
       osc.stop(now + 1.0);
       break;

    case 'DOT':
       osc.type = 'sine';
       osc.frequency.setValueAtTime(800, now);
       gain.gain.setValueAtTime(0.1, now);
       osc.start(now);
       osc.stop(now + 0.06);
       break;

    case 'DASH':
       osc.type = 'sine';
       osc.frequency.setValueAtTime(800, now);
       gain.gain.setValueAtTime(0.1, now);
       osc.start(now);
       osc.stop(now + 0.18); // 3x DOT
       break;

    case 'TELEGRAPH_SEND':
        // Old timey "sent" chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

    case 'STEP_SNEAK':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

    case 'ALERT':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
  }
};

export const initAudio = () => {
    getCtx();
    startAmbience();
};
