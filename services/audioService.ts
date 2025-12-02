
// Simple procedural audio synthesizer to avoid external assets
// Uses Web Audio API

let audioCtx: AudioContext | null = null;
let ambienceNode: AudioBufferSourceNode | null = null;
let ambienceGain: GainNode | null = null;

// Battle music state
let battleMusicPlaying = false;
let battleOscillators: OscillatorNode[] = [];
let battleGains: GainNode[] = [];
let battleInterval: NodeJS.Timeout | null = null;
let arpeggioInterval: NodeJS.Timeout | null = null;

// Zone music state
let zoneMusicPlaying = false;
let zoneMusicOscillators: OscillatorNode[] = [];
let zoneMusicGains: GainNode[] = [];
let zoneMusicIntervals: NodeJS.Timeout[] = [];
let currentZoneMusicType: string | null = null;

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

export const playSound = (type: 'BLIP' | 'TYPEWRITER' | 'ERROR' | 'SUCCESS' | 'AMBIENCE' | 'ELEVATOR' | 'ELEVATOR_CLANK' | 'WIND_HIGH' | 'FALL' | 'FOOTSTEP' | 'ATTACK' | 'DAMAGE' | 'DOT' | 'DASH' | 'TELEGRAPH_SEND' | 'STEP_SNEAK' | 'ALERT' | 'COLLISION_MARBLE' | 'COLLISION_BRASS' | 'COLLISION_WOOD' | 'COLLISION_GLASS' | 'COLLISION_IRON' | 'HEDGE_RUSTLE' | 'BREAKAGE' | 'VOICE_MUMBLE') => {
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
       // Mechanical elevator motor starting up
       osc.type = 'sawtooth';
       osc.frequency.setValueAtTime(30, now);
       osc.frequency.linearRampToValueAtTime(60, now + 0.5);
       osc.frequency.setValueAtTime(60, now + 3);
       osc.frequency.linearRampToValueAtTime(30, now + 3.5);
       gain.gain.setValueAtTime(0.08, now);
       gain.gain.linearRampToValueAtTime(0.05, now + 0.5);
       gain.gain.setValueAtTime(0.05, now + 3);
       gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
       osc.start(now);
       osc.stop(now + 4);
       break;

    case 'ELEVATOR_CLANK':
        // Rhythmic mechanical clanking
        osc.type = 'square';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.setValueAtTime(60, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

    case 'WIND_HIGH':
        // High altitude wind (use noise)
        const windBuffer = createBrownNoise(ctx);
        const windSource = ctx.createBufferSource();
        const windGain = ctx.createGain();
        const windFilter = ctx.createBiquadFilter();

        windSource.buffer = windBuffer;
        windFilter.type = 'highpass';
        windFilter.frequency.value = 1000;
        windGain.gain.setValueAtTime(0.04, now);

        windSource.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(ctx.destination);
        windSource.start(now);
        windSource.stop(now + 2);
        // Return early since we used a different audio path
        return;

    case 'FALL':
        // Falling/whoosh sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 1.5);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 1);
        gain.gain.linearRampToValueAtTime(0.3, now + 1.5);
        osc.start(now);
        osc.stop(now + 1.6);
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

    case 'COLLISION_MARBLE':
        // Solid, resonant impact - like hitting a marble statue or column
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.25);
        // Add a higher harmonic for richness
        const marbleOsc2 = ctx.createOscillator();
        const marbleGain2 = ctx.createGain();
        marbleOsc2.type = 'sine';
        marbleOsc2.frequency.setValueAtTime(500, now);
        marbleGain2.gain.setValueAtTime(0.05, now);
        marbleGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        marbleOsc2.connect(marbleGain2);
        marbleGain2.connect(ctx.destination);
        marbleOsc2.start(now);
        marbleOsc2.stop(now + 0.15);
        break;

    case 'COLLISION_BRASS':
        // Metallic clang with ring - like hitting brass railing or display case
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.35);
        // Ring overtone
        const brassOsc2 = ctx.createOscillator();
        const brassGain2 = ctx.createGain();
        brassOsc2.type = 'sine';
        brassOsc2.frequency.setValueAtTime(800, now);
        brassGain2.gain.setValueAtTime(0.04, now);
        brassGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        brassOsc2.connect(brassGain2);
        brassGain2.connect(ctx.destination);
        brassOsc2.start(now);
        brassOsc2.stop(now + 0.3);
        break;

    case 'COLLISION_WOOD':
        // Dull thud - like hitting wooden furniture or bench
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

    case 'COLLISION_GLASS':
        // High-pitched tink - like hitting glass display
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

    case 'COLLISION_IRON':
        // Deep metallic clunk - like hitting iron machinery or pylons
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.15);
        const ironFilter = ctx.createBiquadFilter();
        ironFilter.type = 'lowpass';
        ironFilter.frequency.value = 200;
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.disconnect();
        osc.connect(ironFilter);
        ironFilter.connect(gain);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

    case 'HEDGE_RUSTLE':
        // Rustling leaves - filtered noise
        const hedgeBuffer = createBrownNoise(ctx);
        const hedgeSource = ctx.createBufferSource();
        const hedgeGain = ctx.createGain();
        const hedgeFilter = ctx.createBiquadFilter();
        hedgeSource.buffer = hedgeBuffer;
        hedgeFilter.type = 'bandpass';
        hedgeFilter.frequency.value = 2000;
        hedgeFilter.Q.value = 0.5;
        hedgeGain.gain.setValueAtTime(0.08, now);
        hedgeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        hedgeSource.connect(hedgeFilter);
        hedgeFilter.connect(hedgeGain);
        hedgeGain.connect(ctx.destination);
        hedgeSource.start(now);
        hedgeSource.stop(now + 0.35);
        return;

    case 'BREAKAGE':
        // Crash/shatter sound - something breaking
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.45);
        // Add crash noise
        const crashBuffer = createBrownNoise(ctx);
        const crashSource = ctx.createBufferSource();
        const crashGain = ctx.createGain();
        const crashFilter = ctx.createBiquadFilter();
        crashSource.buffer = crashBuffer;
        crashFilter.type = 'highpass';
        crashFilter.frequency.value = 1500;
        crashGain.gain.setValueAtTime(0.15, now);
        crashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        crashSource.connect(crashFilter);
        crashFilter.connect(crashGain);
        crashGain.connect(ctx.destination);
        crashSource.start(now);
        crashSource.stop(now + 0.35);
        break;

    case 'VOICE_MUMBLE':
        // French-sounding mumble - nasal vowel sounds with varied pitch
        // Creates a "speaking" effect without actual words
        const baseFreq = 180 + Math.random() * 80; // Varied pitch range
        const duration = 0.08 + Math.random() * 0.06;

        // Main voice formant (nasal French-like quality)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, now);
        // Pitch variation within syllable (French intonation)
        osc.frequency.linearRampToValueAtTime(baseFreq * (0.9 + Math.random() * 0.3), now + duration * 0.7);

        // Formant filter for vowel quality (nasal "en/an" French sounds)
        const voiceFilter = ctx.createBiquadFilter();
        voiceFilter.type = 'bandpass';
        voiceFilter.frequency.value = 500 + Math.random() * 400; // Vowel formant
        voiceFilter.Q.value = 3 + Math.random() * 4;

        // Second formant for richness
        const voiceFilter2 = ctx.createBiquadFilter();
        voiceFilter2.type = 'bandpass';
        voiceFilter2.frequency.value = 1500 + Math.random() * 800;
        voiceFilter2.Q.value = 2;

        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(0.06, now);
        voiceGain.gain.linearRampToValueAtTime(0.08, now + duration * 0.3);
        voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.disconnect();
        osc.connect(voiceFilter);
        voiceFilter.connect(voiceFilter2);
        voiceFilter2.connect(voiceGain);
        voiceGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.02);
        break;
  }
};

export const initAudio = () => {
    getCtx();
    // Audio context initialized - zone music will start when entering zones
};

// Battle Music - A Henry James-esque tension theme inspired by FF6
// Uses minor key arpeggios, dramatic bass, and literary flourishes

const BATTLE_TEMPO = 140; // BPM
const BEAT_LENGTH = 60 / BATTLE_TEMPO;

// D minor scale for that dramatic Victorian tension
const SCALE = {
    D3: 146.83,
    E3: 164.81,
    F3: 174.61,
    G3: 196.00,
    A3: 220.00,
    Bb3: 233.08,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    Bb4: 466.16,
    C5: 523.25,
    D5: 587.33,
};

// Bass pattern - dramatic, pulsing foundation
const bassPattern = [
    SCALE.D3, null, SCALE.D3, null,
    SCALE.A3, null, SCALE.F3, null,
    SCALE.G3, null, SCALE.G3, null,
    SCALE.A3, null, SCALE.Bb3, SCALE.A3,
];

// Arpeggio patterns - tense, literary flourishes
const arpeggioPatterns = [
    [SCALE.D4, SCALE.F4, SCALE.A4, SCALE.D5],
    [SCALE.Bb3, SCALE.D4, SCALE.F4, SCALE.Bb4],
    [SCALE.G3, SCALE.Bb3, SCALE.D4, SCALE.G4],
    [SCALE.A3, SCALE.C4, SCALE.E4, SCALE.A4],
];

// Melody fragments - nervous, intellectual tension
const melodyPatterns = [
    [SCALE.A4, SCALE.G4, SCALE.F4, SCALE.E4, SCALE.D4],
    [SCALE.D5, SCALE.C5, SCALE.Bb4, SCALE.A4],
    [SCALE.F4, SCALE.G4, SCALE.A4, SCALE.Bb4, SCALE.A4, SCALE.G4],
    [SCALE.E4, SCALE.F4, SCALE.G4, SCALE.F4, SCALE.E4, SCALE.D4],
];

let bassStep = 0;
let measureCount = 0;
let currentArpPattern = 0;

export const startBattleMusic = () => {
    if (battleMusicPlaying) return;

    // Stop zone music when battle starts
    stopZoneMusic();

    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    battleMusicPlaying = true;
    bassStep = 0;
    measureCount = 0;
    currentArpPattern = 0;

    // Create master gain for battle music
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);

    // Bass drum pulse - the heartbeat of social anxiety
    const playBass = () => {
        if (!battleMusicPlaying) return;

        const note = bassPattern[bassStep % bassPattern.length];

        if (note) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.value = note;

            filter.type = 'lowpass';
            filter.frequency.value = 300;
            filter.Q.value = 2;

            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + BEAT_LENGTH * 0.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start();
            osc.stop(ctx.currentTime + BEAT_LENGTH * 0.9);
        }

        bassStep++;

        // Every 16 beats, change arpeggio pattern
        if (bassStep % 16 === 0) {
            measureCount++;
            currentArpPattern = (currentArpPattern + 1) % arpeggioPatterns.length;
        }
    };

    // Arpeggio - the nervous intellectual energy
    const playArpeggio = () => {
        if (!battleMusicPlaying) return;

        const pattern = arpeggioPatterns[currentArpPattern];
        const arpStep = (bassStep * 2) % pattern.length;
        const note = pattern[arpStep];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = note;

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + BEAT_LENGTH * 0.4);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + BEAT_LENGTH * 0.5);
    };

    // Occasional melody flourish - the wit and riposte
    const playMelodyFlourish = () => {
        if (!battleMusicPlaying) return;
        if (Math.random() > 0.3) return; // Only play 30% of the time

        const pattern = melodyPatterns[Math.floor(Math.random() * melodyPatterns.length)];

        pattern.forEach((note, i) => {
            setTimeout(() => {
                if (!battleMusicPlaying) return;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = note;

                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + BEAT_LENGTH * 0.3);

                osc.connect(gain);
                gain.connect(masterGain);

                osc.start();
                osc.stop(ctx.currentTime + BEAT_LENGTH * 0.35);
            }, i * BEAT_LENGTH * 250);
        });
    };

    // String pad - sustained tension
    const createStringPad = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.value = SCALE.D3;
        osc2.frequency.value = SCALE.A3;

        // Slight detune for richness
        osc2.detune.value = 5;

        filter.type = 'lowpass';
        filter.frequency.value = 800;

        gain.gain.value = 0.06;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc1.start();
        osc2.start();

        battleOscillators.push(osc1, osc2);
        battleGains.push(gain);

        // Slowly modulate the pad
        const modulatePad = () => {
            if (!battleMusicPlaying) return;

            const chordRoot = [SCALE.D3, SCALE.Bb3, SCALE.G3, SCALE.A3][measureCount % 4];
            osc1.frequency.setTargetAtTime(chordRoot, ctx.currentTime, 0.5);
            osc2.frequency.setTargetAtTime(chordRoot * 1.5, ctx.currentTime, 0.5);
        };

        setInterval(modulatePad, BEAT_LENGTH * 4000);
    };

    // High tension tremolo strings
    const createTremoloStrings = () => {
        const osc = ctx.createOscillator();
        const tremolo = ctx.createOscillator();
        const tremoloGain = ctx.createGain();
        const mainGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = SCALE.F4;

        tremolo.type = 'sine';
        tremolo.frequency.value = 8; // Tremolo speed

        tremoloGain.gain.value = 0.03;
        mainGain.gain.value = 0.08;

        tremolo.connect(tremoloGain.gain);
        osc.connect(mainGain);
        mainGain.connect(masterGain);

        tremolo.start();
        osc.start();

        battleOscillators.push(osc, tremolo);
        battleGains.push(mainGain, tremoloGain);
    };

    // Start all the layers
    createStringPad();
    createTremoloStrings();

    // Main rhythm loop
    battleInterval = setInterval(playBass, BEAT_LENGTH * 1000);
    arpeggioInterval = setInterval(playArpeggio, BEAT_LENGTH * 500);

    // Melody flourishes every 2 measures
    setInterval(playMelodyFlourish, BEAT_LENGTH * 8000);
};

export const stopBattleMusic = () => {
    if (!battleMusicPlaying) return;

    battleMusicPlaying = false;

    // Clear intervals
    if (battleInterval) {
        clearInterval(battleInterval);
        battleInterval = null;
    }
    if (arpeggioInterval) {
        clearInterval(arpeggioInterval);
        arpeggioInterval = null;
    }

    // Fade out and stop oscillators
    const ctx = getCtx();
    battleGains.forEach(gain => {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    });

    setTimeout(() => {
        battleOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Already stopped
            }
        });
        battleOscillators = [];
        battleGains = [];
    }, 600);
};

export const isBattleMusicPlaying = () => battleMusicPlaying;

// ============================================
// ZONE MUSIC SYSTEM
// Different musical themes for different areas
// ============================================

// Musical scales and notes
const NOTES = {
    // Western chromatic
    C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
    C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
    // Pentatonic (for Eastern themes)
    Db4: 277.18, Gb4: 369.99, Db5: 554.37, Gb5: 739.99,
};

// Stop any currently playing zone music
export const stopZoneMusic = () => {
    // Reset zone type tracking
    currentZoneMusicType = null;

    if (!zoneMusicPlaying) return;

    zoneMusicPlaying = false;

    // Clear all intervals
    zoneMusicIntervals.forEach(interval => clearInterval(interval));
    zoneMusicIntervals = [];

    // Fade out and stop oscillators
    const ctx = getCtx();
    zoneMusicGains.forEach(gain => {
        try {
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        } catch (e) {}
    });

    setTimeout(() => {
        zoneMusicOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
        });
        zoneMusicOscillators = [];
        zoneMusicGains = [];
    }, 600);
};

// Determine music type based on zone name
const getZoneMusicType = (zoneName: string): string => {
    const name = zoneName.toLowerCase();

    // Exotic/Colonial pavilions - Souk areas
    if (name.includes('souk') || name.includes('caire') || name.includes('cairo') || name.includes('egypt')) return 'souk';
    if (name.includes('tunis')) return 'arabian';
    if (name.includes('siam') || name.includes('annam') || name.includes('asia') || name.includes('orient')) return 'siamese';
    if (name.includes('alger') || name.includes('morocco') || name.includes('arab')) return 'arabian';
    if (name.includes('japan') || name.includes('chin')) return 'japanese';

    // Concert Hall
    if (name.includes('concert') || name.includes('trocadéro concert') || name.includes('orchestra')) return 'concertHall';

    // Grand architectural spaces - Tower levels
    if (name.includes('second platform') || name.includes('tower second') || name.includes('level 2')) return 'towerPlatform';
    if (name.includes('first floor') || name.includes('tower first')) return 'towerFirstFloor';
    if (name.includes('eiffel') || name.includes('tower') || name.includes('base of')) return 'tower';

    // Industrial/Galerie des Machines
    if (name.includes('machine') || name.includes('galerie') || name.includes('edison') || name.includes('telephone') || name.includes('creusot') || name.includes('annex')) return 'industrial';
    if (name.includes('dome') || name.includes('grand') || name.includes('central')) return 'grandHall';

    // Gardens and outdoor
    if (name.includes('champ') || name.includes('mars') || name.includes('garden') || name.includes('esplanade')) return 'garden';
    if (name.includes('trocad') && !name.includes('concert')) return 'trocadero';

    // Art spaces
    if (name.includes('beaux') || name.includes('art') || name.includes('salon')) return 'salon';

    // Streets and entrances
    if (name.includes('pont') || name.includes('bridge')) return 'bridge';
    if (name.includes('porte') || name.includes('gate') || name.includes('entrance')) return 'street';
    if (name.includes('rue') || name.includes('street')) return 'street';

    // Default
    return 'ambient';
};

// Start zone-appropriate music
export const startZoneMusic = (zoneName: string) => {
    const musicType = getZoneMusicType(zoneName);

    // Don't restart if same music is already playing
    if (zoneMusicPlaying && currentZoneMusicType === musicType) return;

    // Stop current music first
    stopZoneMusic();

    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    zoneMusicPlaying = true;
    currentZoneMusicType = musicType;

    // Master gain for zone music
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08;
    masterGain.connect(ctx.destination);
    zoneMusicGains.push(masterGain);

    switch (musicType) {
        case 'garden':
            createGardenAmbience(ctx, masterGain);
            break;
        case 'tower':
            createTowerMusic(ctx, masterGain);
            break;
        case 'towerPlatform':
            createTowerPlatformMusic(ctx, masterGain);
            break;
        case 'towerFirstFloor':
            createTowerFirstFloorMusic(ctx, masterGain);
            break;
        case 'industrial':
            createIndustrialAmbience(ctx, masterGain);
            break;
        case 'grandHall':
            createGrandHallMusic(ctx, masterGain);
            break;
        case 'salon':
            createSalonMusic(ctx, masterGain);
            break;
        case 'souk':
            createSoukMusic(ctx, masterGain);
            break;
        case 'concertHall':
            createConcertHallMusic(ctx, masterGain);
            break;
        case 'egyptian':
            createEgyptianMusic(ctx, masterGain);
            break;
        case 'siamese':
            createSiameseMusic(ctx, masterGain);
            break;
        case 'arabian':
            createArabianMusic(ctx, masterGain);
            break;
        case 'japanese':
            createJapaneseMusic(ctx, masterGain);
            break;
        case 'trocadero':
            createTrocaderoMusic(ctx, masterGain);
            break;
        default:
            // Garden is default for unmatched zones that aren't white noise zones
            createGardenAmbience(ctx, masterGain);
    }
};

// ============================================
// INDIVIDUAL ZONE MUSIC GENERATORS
// ============================================

// Track buffer sources separately for cleanup
let zoneMusicBufferSources: AudioBufferSourceNode[] = [];

// Garden - peaceful, pastoral with birdsong-like tones (no sustained drone)
const createGardenAmbience = (ctx: AudioContext, master: GainNode) => {
    // Bird-like chirps - the main musical element
    const birdNotes = [NOTES.E5, NOTES.G5, NOTES.A5, NOTES.E5, NOTES.D5, NOTES.C5];
    let birdIndex = 0;

    const chirp = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.5) return; // 50% chance each interval

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = birdNotes[birdIndex % birdNotes.length];
        birdIndex++;

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    };

    // Stagger multiple bird chirp intervals for more natural sound
    zoneMusicIntervals.push(setInterval(chirp, 1500 + Math.random() * 2000));
    zoneMusicIntervals.push(setInterval(chirp, 2500 + Math.random() * 3000));

    // Occasional gentle chord swells instead of constant drone
    const chordNotes = [NOTES.C4, NOTES.E4, NOTES.G4];
    const playChord = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.3) return; // 30% chance

        chordNotes.forEach((note, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = note;
            filter.type = 'lowpass';
            filter.frequency.value = 600;

            // Gentle swell in and out
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + 3.5);
        });
    };

    zoneMusicIntervals.push(setInterval(playChord, 8000));
    // Play one chord after a short delay to start
    setTimeout(playChord, 1000);
};

// Tower - awe-inspiring, metallic, vertiginous (Base of Eiffel Tower)
const createTowerMusic = (ctx: AudioContext, master: GainNode) => {
    // Deep metallic drone - the massive iron structure resonating
    const drone1 = ctx.createOscillator();
    const drone2 = ctx.createOscillator();
    const drone3 = ctx.createOscillator();
    const droneGain = ctx.createGain();

    drone1.type = 'sawtooth';
    drone2.type = 'sawtooth';
    drone3.type = 'triangle';
    drone1.frequency.value = NOTES.C3;
    drone2.frequency.value = NOTES.G3;
    drone3.frequency.value = NOTES.C3 / 2; // Sub-bass
    drone2.detune.value = 3;

    droneGain.gain.value = 0.05;

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 180;

    drone1.connect(droneFilter);
    drone2.connect(droneFilter);
    drone3.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);

    drone1.start();
    drone2.start();
    drone3.start();

    zoneMusicOscillators.push(drone1, drone2, drone3);
    zoneMusicGains.push(droneGain);

    // Elevator machinery - hydraulic pump sounds
    let elevatorBeat = 0;
    const elevatorPump = () => {
        if (!zoneMusicPlaying) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = 45 + (elevatorBeat % 3) * 5;
        elevatorBeat++;

        filter.type = 'lowpass';
        filter.frequency.value = 100;

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    };

    zoneMusicIntervals.push(setInterval(elevatorPump, 800));

    // Metallic shimmer (wind through iron lattice)
    const shimmerNotes = [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C5, NOTES.D5];
    let shimmerIdx = 0;

    const shimmer = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.6) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = shimmerNotes[shimmerIdx % shimmerNotes.length];
        shimmerIdx++;

        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2);
    };

    zoneMusicIntervals.push(setInterval(shimmer, 2500));

    // Iron creaking sounds
    const creak = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.3) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80 + Math.random() * 40, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60 + Math.random() * 30, ctx.currentTime + 0.4);

        filter.type = 'bandpass';
        filter.frequency.value = 150;
        filter.Q.value = 4;

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    };

    zoneMusicIntervals.push(setInterval(creak, 5000));

    // Crowd atmosphere - excited visitors
    const crowdBuffer = createBrownNoise(ctx);
    const crowd = ctx.createBufferSource();
    const crowdGain = ctx.createGain();
    const crowdFilter = ctx.createBiquadFilter();

    crowd.buffer = crowdBuffer;
    crowd.loop = true;
    crowdFilter.type = 'bandpass';
    crowdFilter.frequency.value = 450;
    crowdFilter.Q.value = 0.4;
    crowdGain.gain.value = 0.025;

    crowd.connect(crowdFilter);
    crowdFilter.connect(crowdGain);
    crowdGain.connect(master);
    crowd.start();

    zoneMusicGains.push(crowdGain);

    // Occasional elevator arrival clang
    const elevatorClang = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.15) return;

        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc2.type = 'triangle';
        osc.frequency.value = 100;
        osc2.frequency.value = 250;

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(master);
        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 0.25);
        osc2.stop(ctx.currentTime + 0.25);
    };

    zoneMusicIntervals.push(setInterval(elevatorClang, 8000));

    // Light wind at ground level
    const windBuffer = createBrownNoise(ctx);
    const wind = ctx.createBufferSource();
    const windGain = ctx.createGain();
    const windFilter = ctx.createBiquadFilter();

    wind.buffer = windBuffer;
    wind.loop = true;
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 600;
    windFilter.Q.value = 0.3;
    windGain.gain.value = 0.015;

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    wind.start();

    zoneMusicGains.push(windGain);
};

// Tower Platform - vertiginous, wind-swept, awe-inspiring
const createTowerPlatformMusic = (ctx: AudioContext, master: GainNode) => {
    // High wind sound
    const windBuffer = createBrownNoise(ctx);
    const wind = ctx.createBufferSource();
    const windGain = ctx.createGain();
    const windFilter = ctx.createBiquadFilter();

    wind.buffer = windBuffer;
    wind.loop = true;
    windFilter.type = 'highpass';
    windFilter.frequency.value = 1200;
    windGain.gain.value = 0.05;

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    wind.start();

    zoneMusicGains.push(windGain);

    // Ethereal, vertiginous chords
    const chordNotes = [
        [NOTES.C5, NOTES.E5, NOTES.G5],
        [NOTES.A4, NOTES.C5, NOTES.E5],
        [NOTES.F4, NOTES.A4, NOTES.C5],
    ];
    let chordIdx = 0;

    const playEtherealChord = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.4) return;

        const chord = chordNotes[chordIdx % chordNotes.length];
        chordIdx++;

        chord.forEach((note, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = note;

            // Ethereal swell
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.5);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);

            osc.connect(gain);
            gain.connect(master);
            osc.start(ctx.currentTime + i * 0.2);
            osc.stop(ctx.currentTime + 4.5);
        });
    };

    zoneMusicIntervals.push(setInterval(playEtherealChord, 5000));
    setTimeout(playEtherealChord, 1000);

    // Occasional metallic creaking (iron structure)
    const creak = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.3) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100 + Math.random() * 50, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80 + Math.random() * 30, ctx.currentTime + 0.5);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 200;
        filter.Q.value = 5;

        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    };

    zoneMusicIntervals.push(setInterval(creak, 4000));
};

// Industrial - mechanical, rhythmic, steam-punk (Galerie des Machines)
const createIndustrialAmbience = (ctx: AudioContext, master: GainNode) => {
    // Deep continuous machinery rumble
    const rumble = ctx.createOscillator();
    const rumble2 = ctx.createOscillator();
    const rumbleGain = ctx.createGain();

    rumble.type = 'sawtooth';
    rumble2.type = 'sawtooth';
    rumble.frequency.value = 35;
    rumble2.frequency.value = 42; // Slightly different for beating effect
    rumbleGain.gain.value = 0.08;

    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 80;

    rumble.connect(rumbleFilter);
    rumble2.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(master);
    rumble.start();
    rumble2.start();

    zoneMusicOscillators.push(rumble, rumble2);
    zoneMusicGains.push(rumbleGain);

    // Steam engine piston rhythm (chuff-chuff-chuff)
    let pistonBeat = 0;
    const piston = () => {
        if (!zoneMusicPlaying) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        // Alternating heavy/light beats like a steam engine
        const isHeavyBeat = pistonBeat % 4 === 0;
        osc.frequency.value = isHeavyBeat ? 50 : 70;
        pistonBeat++;

        filter.type = 'lowpass';
        filter.frequency.value = 150;

        gain.gain.setValueAtTime(isHeavyBeat ? 0.12 : 0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    };

    zoneMusicIntervals.push(setInterval(piston, 350)); // Faster rhythm

    // Metallic clanking and hammering
    let clankCount = 0;
    const clank = () => {
        if (!zoneMusicPlaying) return;

        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc2.type = 'triangle';
        // Varied pitches for different machines
        const pitches = [80, 100, 120, 90, 110];
        osc.frequency.value = pitches[clankCount % pitches.length];
        osc2.frequency.value = osc.frequency.value * 2.5; // Harmonic

        clankCount++;

        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(master);
        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.15);
    };

    zoneMusicIntervals.push(setInterval(clank, 600));

    // Steam release hiss (longer, more dramatic)
    const hiss = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.4) return;

        const noise = ctx.createBufferSource();
        const noiseGain = ctx.createGain();
        const noiseFilter = ctx.createBiquadFilter();

        noise.buffer = createBrownNoise(ctx);
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1500;

        const duration = 0.3 + Math.random() * 0.5;
        noiseGain.gain.setValueAtTime(0.06, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);
        noise.start();
        noise.stop(ctx.currentTime + duration + 0.1);
    };

    zoneMusicIntervals.push(setInterval(hiss, 1800));

    // Occasional dynamo whine (electrical hum rising and falling)
    const dynamo = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.25) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const baseFreq = 180 + Math.random() * 40;
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.2, ctx.currentTime + 1);
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 2);

        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 3);
    };

    zoneMusicIntervals.push(setInterval(dynamo, 4000));

    // Crowd murmur in the background (exposition visitors)
    const crowdBuffer = createBrownNoise(ctx);
    const crowd = ctx.createBufferSource();
    const crowdGain = ctx.createGain();
    const crowdFilter = ctx.createBiquadFilter();

    crowd.buffer = crowdBuffer;
    crowd.loop = true;
    crowdFilter.type = 'bandpass';
    crowdFilter.frequency.value = 400;
    crowdFilter.Q.value = 0.3;
    crowdGain.gain.value = 0.02;

    crowd.connect(crowdFilter);
    crowdFilter.connect(crowdGain);
    crowdGain.connect(master);
    crowd.start();

    zoneMusicGains.push(crowdGain);

    // Occasional heavy machinery groan
    const groan = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.2) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(30, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(25, ctx.currentTime + 1.5);

        filter.type = 'lowpass';
        filter.frequency.value = 60;

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2);
    };

    zoneMusicIntervals.push(setInterval(groan, 6000));
};

// Grand Hall - majestic, orchestral, reverberant
const createGrandHallMusic = (ctx: AudioContext, master: GainNode) => {
    // Majestic chord progression
    const chords = [
        [NOTES.C4, NOTES.E4, NOTES.G4],
        [NOTES.F3, NOTES.A3, NOTES.C4],
        [NOTES.G3, NOTES.B3, NOTES.D4],
        [NOTES.C4, NOTES.E4, NOTES.G4],
    ];
    let chordIdx = 0;

    const playChord = () => {
        if (!zoneMusicPlaying) return;

        const chord = chords[chordIdx % chords.length];
        chordIdx++;

        chord.forEach((note, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = note;

            gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);

            osc.connect(gain);
            gain.connect(master);
            osc.start(ctx.currentTime + i * 0.05);
            osc.stop(ctx.currentTime + 4.5);
        });
    };

    playChord();
    zoneMusicIntervals.push(setInterval(playChord, 4000));

    // Reverberant echo pad
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    pad.type = 'sine';
    pad.frequency.value = NOTES.C3;
    padGain.gain.value = 0.04;

    pad.connect(padGain);
    padGain.connect(master);
    pad.start();

    zoneMusicOscillators.push(pad);
    zoneMusicGains.push(padGain);
};

// Salon - elegant, chamber music, refined
const createSalonMusic = (ctx: AudioContext, master: GainNode) => {
    // Gentle waltz-like melody
    const melody = [
        NOTES.E4, NOTES.G4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4,
        NOTES.E4, NOTES.F4, NOTES.G4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4,
    ];
    let melodyIdx = 0;

    const playNote = () => {
        if (!zoneMusicPlaying) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = melody[melodyIdx % melody.length];
        melodyIdx++;

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
    };

    zoneMusicIntervals.push(setInterval(playNote, 600));

    // Soft sustained strings
    const string1 = ctx.createOscillator();
    const string2 = ctx.createOscillator();
    const stringGain = ctx.createGain();

    string1.type = 'sawtooth';
    string2.type = 'sawtooth';
    string1.frequency.value = NOTES.C4;
    string2.frequency.value = NOTES.G3;

    const stringFilter = ctx.createBiquadFilter();
    stringFilter.type = 'lowpass';
    stringFilter.frequency.value = 600;
    stringGain.gain.value = 0.03;

    string1.connect(stringFilter);
    string2.connect(stringFilter);
    stringFilter.connect(stringGain);
    stringGain.connect(master);

    string1.start();
    string2.start();

    zoneMusicOscillators.push(string1, string2);
    zoneMusicGains.push(stringGain);
};

// Egyptian - mysterious, ancient, modal
const createEgyptianMusic = (ctx: AudioContext, master: GainNode) => {
    // Phrygian dominant scale (Egyptian-sounding)
    const scale = [NOTES.D4, NOTES.Eb4, NOTES.Gb4, NOTES.G4, NOTES.A4, NOTES.Bb4, NOTES.C5, NOTES.D5];
    let noteIdx = 0;

    // Drone on D
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sawtooth';
    drone.frequency.value = NOTES.D3;

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 300;
    droneGain.gain.value = 0.06;

    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);
    drone.start();

    zoneMusicOscillators.push(drone);
    zoneMusicGains.push(droneGain);

    // Melodic phrases
    const playPhrase = () => {
        if (!zoneMusicPlaying) return;

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (!zoneMusicPlaying) return;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.value = scale[noteIdx % scale.length];
                noteIdx++;

                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

                osc.connect(gain);
                gain.connect(master);
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            }, i * 300);
        }
    };

    playPhrase();
    zoneMusicIntervals.push(setInterval(playPhrase, 3000));
};

// Siamese/Thai - pentatonic, gamelan-like bells
const createSiameseMusic = (ctx: AudioContext, master: GainNode) => {
    // Thai-inspired pentatonic scale
    const scale = [NOTES.C4, NOTES.D4, NOTES.E4, NOTES.G4, NOTES.A4, NOTES.C5, NOTES.D5, NOTES.E5];
    let noteIdx = 0;

    // Bell-like tones (gamelan inspired)
    const playBell = () => {
        if (!zoneMusicPlaying) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = scale[noteIdx % scale.length];
        noteIdx++;

        // Bell-like envelope
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2.5);
    };

    // Irregular, meditative timing
    const scheduleNext = () => {
        if (!zoneMusicPlaying) return;
        playBell();
        const nextTime = 800 + Math.random() * 1200;
        zoneMusicIntervals.push(setTimeout(scheduleNext, nextTime) as unknown as NodeJS.Timeout);
    };

    scheduleNext();

    // Soft drone
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sine';
    drone.frequency.value = NOTES.C3;
    droneGain.gain.value = 0.04;

    drone.connect(droneGain);
    droneGain.connect(master);
    drone.start();

    zoneMusicOscillators.push(drone);
    zoneMusicGains.push(droneGain);
};

// Arabian - maqam scales, ornamental
const createArabianMusic = (ctx: AudioContext, master: GainNode) => {
    // Hijaz scale (Arabic sounding)
    const scale = [NOTES.D4, NOTES.Eb4, NOTES.Gb4, NOTES.G4, NOTES.A4, NOTES.Bb4, NOTES.Db5, NOTES.D5];
    let noteIdx = 0;

    // Drone
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sawtooth';
    drone.frequency.value = NOTES.D3;

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 250;
    droneGain.gain.value = 0.05;

    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);
    drone.start();

    zoneMusicOscillators.push(drone);
    zoneMusicGains.push(droneGain);

    // Ornamental melodic runs
    const playRun = () => {
        if (!zoneMusicPlaying) return;

        const runLength = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < runLength; i++) {
            setTimeout(() => {
                if (!zoneMusicPlaying) return;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                const direction = Math.random() > 0.5 ? 1 : -1;
                noteIdx = (noteIdx + direction + scale.length) % scale.length;
                osc.frequency.value = scale[noteIdx];

                gain.gain.setValueAtTime(0.09, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

                osc.connect(gain);
                gain.connect(master);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            }, i * 150);
        }
    };

    playRun();
    zoneMusicIntervals.push(setInterval(playRun, 2500));
};

// Japanese - koto-like, pentatonic, sparse
const createJapaneseMusic = (ctx: AudioContext, master: GainNode) => {
    // Japanese pentatonic (in sen scale)
    const scale = [NOTES.D4, NOTES.Eb4, NOTES.G4, NOTES.A4, NOTES.C5, NOTES.D5, NOTES.Eb5];
    let noteIdx = 0;

    // Koto-like plucks
    const pluck = () => {
        if (!zoneMusicPlaying) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = scale[noteIdx % scale.length];
        noteIdx++;

        // Sharp attack, quick decay (koto-like)
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2);
    };

    // Sparse, contemplative timing
    const scheduleNext = () => {
        if (!zoneMusicPlaying) return;
        pluck();
        const nextTime = 1500 + Math.random() * 2000;
        zoneMusicIntervals.push(setTimeout(scheduleNext, nextTime) as unknown as NodeJS.Timeout);
    };

    scheduleNext();

    // Very subtle shakuhachi-like breath tone
    const breath = ctx.createOscillator();
    const breathGain = ctx.createGain();
    const breathFilter = ctx.createBiquadFilter();

    breath.type = 'sine';
    breath.frequency.value = NOTES.D4;
    breathFilter.type = 'bandpass';
    breathFilter.frequency.value = 400;
    breathFilter.Q.value = 2;
    breathGain.gain.value = 0.02;

    breath.connect(breathFilter);
    breathFilter.connect(breathGain);
    breathGain.connect(master);
    breath.start();

    zoneMusicOscillators.push(breath);
    zoneMusicGains.push(breathGain);
};

// Tower First Floor - bustling restaurant ambience, 57 meters up
const createTowerFirstFloorMusic = (ctx: AudioContext, master: GainNode) => {
    // Restaurant clatter and chatter (filtered noise base)
    const chatterBuffer = createBrownNoise(ctx);
    const chatter = ctx.createBufferSource();
    const chatterGain = ctx.createGain();
    const chatterFilter = ctx.createBiquadFilter();

    chatter.buffer = chatterBuffer;
    chatter.loop = true;
    chatterFilter.type = 'bandpass';
    chatterFilter.frequency.value = 600;
    chatterFilter.Q.value = 0.5;
    chatterGain.gain.value = 0.03;

    chatter.connect(chatterFilter);
    chatterFilter.connect(chatterGain);
    chatterGain.connect(master);
    chatter.start();

    zoneMusicGains.push(chatterGain);

    // Elegant restaurant piano - gentle waltz snippets
    const pianoNotes = [
        NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5, NOTES.G4, NOTES.E4,
        NOTES.F4, NOTES.A4, NOTES.C5, NOTES.F4, NOTES.D4, NOTES.B3,
    ];
    let noteIdx = 0;

    const playPiano = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.6) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = pianoNotes[noteIdx % pianoNotes.length];
        noteIdx++;

        // Piano-like envelope
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
    };

    zoneMusicIntervals.push(setInterval(playPiano, 800));

    // Occasional glass/cutlery clink
    const clink = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.25) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 2000 + Math.random() * 1000;

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    };

    zoneMusicIntervals.push(setInterval(clink, 3000));

    // Light wind reminder that we're up high
    const windBuffer = createBrownNoise(ctx);
    const wind = ctx.createBufferSource();
    const windGain = ctx.createGain();
    const windFilter = ctx.createBiquadFilter();

    wind.buffer = windBuffer;
    wind.loop = true;
    windFilter.type = 'highpass';
    windFilter.frequency.value = 1500;
    windGain.gain.value = 0.015;

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    wind.start();

    zoneMusicGains.push(windGain);
};

// Souk - Rue du Caire, bustling Middle Eastern marketplace
const createSoukMusic = (ctx: AudioContext, master: GainNode) => {
    // Hijaz/Phrygian dominant scale (Middle Eastern)
    const scale = [NOTES.D4, NOTES.Eb4, NOTES.Gb4, NOTES.G4, NOTES.A4, NOTES.Bb4, NOTES.C5, NOTES.D5];
    let noteIdx = Math.floor(Math.random() * scale.length);

    // Drone on D (oud-like)
    const drone = ctx.createOscillator();
    const drone2 = ctx.createOscillator();
    const droneGain = ctx.createGain();

    drone.type = 'sawtooth';
    drone2.type = 'sawtooth';
    drone.frequency.value = NOTES.D3;
    drone2.frequency.value = NOTES.A3;
    drone2.detune.value = 5;

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 350;
    droneGain.gain.value = 0.05;

    drone.connect(droneFilter);
    drone2.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);
    drone.start();
    drone2.start();

    zoneMusicOscillators.push(drone, drone2);
    zoneMusicGains.push(droneGain);

    // Melodic ney/flute-like phrases
    const playPhrase = () => {
        if (!zoneMusicPlaying) return;

        const phraseLength = 4 + Math.floor(Math.random() * 4);
        for (let i = 0; i < phraseLength; i++) {
            setTimeout(() => {
                if (!zoneMusicPlaying) return;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                // Move up or down the scale
                const dir = Math.random() > 0.4 ? 1 : -1;
                noteIdx = Math.max(0, Math.min(scale.length - 1, noteIdx + dir));
                osc.frequency.value = scale[noteIdx];

                // Add slight vibrato
                const vibrato = ctx.createOscillator();
                const vibratoGain = ctx.createGain();
                vibrato.frequency.value = 5;
                vibratoGain.gain.value = 3;
                vibrato.connect(vibratoGain);
                vibratoGain.connect(osc.frequency);
                vibrato.start();
                vibrato.stop(ctx.currentTime + 0.4);

                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

                osc.connect(gain);
                gain.connect(master);
                osc.start();
                osc.stop(ctx.currentTime + 0.4);
            }, i * 200);
        }
    };

    playPhrase();
    zoneMusicIntervals.push(setInterval(playPhrase, 2500));

    // Crowd murmur
    const crowdBuffer = createBrownNoise(ctx);
    const crowd = ctx.createBufferSource();
    const crowdGain = ctx.createGain();
    const crowdFilter = ctx.createBiquadFilter();

    crowd.buffer = crowdBuffer;
    crowd.loop = true;
    crowdFilter.type = 'bandpass';
    crowdFilter.frequency.value = 500;
    crowdFilter.Q.value = 0.4;
    crowdGain.gain.value = 0.025;

    crowd.connect(crowdFilter);
    crowdFilter.connect(crowdGain);
    crowdGain.connect(master);
    crowd.start();

    zoneMusicGains.push(crowdGain);

    // Occasional donkey bray (low comical tone)
    const bray = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.15) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
        osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.5);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 300;
        filter.Q.value = 3;

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
    };

    zoneMusicIntervals.push(setInterval(bray, 8000));
};

// Concert Hall - Rimsky-Korsakov conducting Russian music
const createConcertHallMusic = (ctx: AudioContext, master: GainNode) => {
    // Russian Romantic orchestral style
    // Using D minor/B-flat major for that dramatic Slavic sound
    const orchestralChords = [
        [NOTES.D4, NOTES.F4, NOTES.A4],      // D minor
        [NOTES.Bb3, NOTES.D4, NOTES.F4],     // Bb major
        [NOTES.G3, NOTES.Bb3, NOTES.D4],     // G minor
        [NOTES.A3, NOTES.C4, NOTES.E4],      // A major (dominant)
    ];
    let chordIdx = 0;

    // Rich string section
    const createStrings = () => {
        const chord = orchestralChords[chordIdx % orchestralChords.length];
        chordIdx++;

        chord.forEach((note, i) => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            // Layered sawteeth for string richness
            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';
            osc1.frequency.value = note;
            osc2.frequency.value = note * 1.002; // Slight detune for chorus

            filter.type = 'lowpass';
            filter.frequency.value = 1200;

            // Orchestral swell
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.5);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(master);

            osc1.start(ctx.currentTime + i * 0.1);
            osc2.start(ctx.currentTime + i * 0.1);
            osc1.stop(ctx.currentTime + 4.5);
            osc2.stop(ctx.currentTime + 4.5);
        });
    };

    createStrings();
    zoneMusicIntervals.push(setInterval(() => {
        if (!zoneMusicPlaying) return;
        createStrings();
    }, 4000));

    // Woodwind melody (oboe-like) - Scheherazade inspired
    const melodyNotes = [
        NOTES.A4, NOTES.Bb4, NOTES.A4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4,
        NOTES.E4, NOTES.F4, NOTES.G4, NOTES.A4, NOTES.Bb4, NOTES.A4,
    ];
    let melodyIdx = 0;

    const playMelody = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.5) return;

        const phraseLength = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < phraseLength; i++) {
            setTimeout(() => {
                if (!zoneMusicPlaying) return;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = melodyNotes[melodyIdx % melodyNotes.length];
                melodyIdx++;

                // Add vibrato for expressiveness
                const vibrato = ctx.createOscillator();
                const vibratoGain = ctx.createGain();
                vibrato.frequency.value = 5.5;
                vibratoGain.gain.value = 4;
                vibrato.connect(vibratoGain);
                vibratoGain.connect(osc.frequency);
                vibrato.start();
                vibrato.stop(ctx.currentTime + 0.6);

                gain.gain.setValueAtTime(0.06, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

                osc.connect(gain);
                gain.connect(master);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
            }, i * 350);
        }
    };

    zoneMusicIntervals.push(setInterval(playMelody, 3000));
    setTimeout(playMelody, 1500);

    // Hall reverb/ambience - subtle crowd settling sounds
    const ambienceBuffer = createBrownNoise(ctx);
    const ambience = ctx.createBufferSource();
    const ambienceGain = ctx.createGain();
    const ambienceFilter = ctx.createBiquadFilter();

    ambience.buffer = ambienceBuffer;
    ambience.loop = true;
    ambienceFilter.type = 'lowpass';
    ambienceFilter.frequency.value = 200;
    ambienceGain.gain.value = 0.02;

    ambience.connect(ambienceFilter);
    ambienceFilter.connect(ambienceGain);
    ambienceGain.connect(master);
    ambience.start();

    zoneMusicGains.push(ambienceGain);

    // Timpani roll on chord changes
    const timpani = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.3) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = NOTES.D3 / 2; // Low D

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
    };

    zoneMusicIntervals.push(setInterval(timpani, 6000));
};

// Trocadéro - grand, panoramic, Parisian elegance
const createTrocaderoMusic = (ctx: AudioContext, master: GainNode) => {
    // French-style waltz chords
    const chords = [
        [NOTES.C4, NOTES.E4, NOTES.G4],
        [NOTES.A3, NOTES.C4, NOTES.E4],
        [NOTES.F3, NOTES.A3, NOTES.C4],
        [NOTES.G3, NOTES.B3, NOTES.D4],
    ];
    let chordIdx = 0;
    let beat = 0;

    const waltz = () => {
        if (!zoneMusicPlaying) return;

        const chord = chords[chordIdx % chords.length];

        if (beat % 3 === 0) {
            // Bass note on beat 1
            const bass = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bass.type = 'triangle';
            bass.frequency.value = chord[0] / 2;
            bassGain.gain.setValueAtTime(0.1, ctx.currentTime);
            bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            bass.connect(bassGain);
            bassGain.connect(master);
            bass.start();
            bass.stop(ctx.currentTime + 0.5);
        } else {
            // Chord on beats 2 and 3
            chord.forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = note;
                gain.gain.setValueAtTime(0.04, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.connect(gain);
                gain.connect(master);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            });
        }

        beat++;
        if (beat % 6 === 0) chordIdx++;
    };

    zoneMusicIntervals.push(setInterval(waltz, 400));
};

// Bridge - flowing water, wind, transitional
const createBridgeAmbience = (ctx: AudioContext, master: GainNode) => {
    // Water sounds (filtered noise)
    const waterBuffer = createBrownNoise(ctx);
    const water = ctx.createBufferSource();
    const waterGain = ctx.createGain();
    const waterFilter = ctx.createBiquadFilter();

    water.buffer = waterBuffer;
    water.loop = true;
    waterFilter.type = 'bandpass';
    waterFilter.frequency.value = 500;
    waterFilter.Q.value = 0.3;
    waterGain.gain.value = 0.06;

    water.connect(waterFilter);
    waterFilter.connect(waterGain);
    waterGain.connect(master);
    water.start();

    zoneMusicGains.push(waterGain);

    // Wind
    const windBuffer = createBrownNoise(ctx);
    const wind = ctx.createBufferSource();
    const windGain = ctx.createGain();
    const windFilter = ctx.createBiquadFilter();

    wind.buffer = windBuffer;
    wind.loop = true;
    windFilter.type = 'highpass';
    windFilter.frequency.value = 800;
    windGain.gain.value = 0.02;

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    wind.start();

    zoneMusicGains.push(windGain);

    // Occasional boat horn
    const horn = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.2) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = 120;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2.5);
    };

    zoneMusicIntervals.push(setInterval(horn, 8000));
};

// Street - bustling, crowd murmur, carriages
const createStreetAmbience = (ctx: AudioContext, master: GainNode) => {
    // Crowd murmur (filtered noise)
    const crowdBuffer = createBrownNoise(ctx);
    const crowd = ctx.createBufferSource();
    const crowdGain = ctx.createGain();
    const crowdFilter = ctx.createBiquadFilter();

    crowd.buffer = crowdBuffer;
    crowd.loop = true;
    crowdFilter.type = 'bandpass';
    crowdFilter.frequency.value = 400;
    crowdFilter.Q.value = 0.5;
    crowdGain.gain.value = 0.04;

    crowd.connect(crowdFilter);
    crowdFilter.connect(crowdGain);
    crowdGain.connect(master);
    crowd.start();

    zoneMusicGains.push(crowdGain);

    // Carriage wheels
    const carriage = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.3) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = 60 + Math.random() * 20;

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 1);
    };

    zoneMusicIntervals.push(setInterval(carriage, 3000));

    // Vendor calls (simple melodic snippets)
    const callNotes = [NOTES.G4, NOTES.E4, NOTES.C4];
    let callIdx = 0;

    const vendorCall = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.2) return;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (!zoneMusicPlaying) return;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = callNotes[(callIdx + i) % callNotes.length];

                gain.gain.setValueAtTime(0.06, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

                osc.connect(gain);
                gain.connect(master);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            }, i * 200);
        }
        callIdx++;
    };

    zoneMusicIntervals.push(setInterval(vendorCall, 5000));
};

// Default ambient - subtle, neutral
const createDefaultAmbience = (ctx: AudioContext, master: GainNode) => {
    // Soft pad
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();

    pad.type = 'sine';
    pad.frequency.value = NOTES.C4;
    padGain.gain.value = 0.03;

    pad.connect(padGain);
    padGain.connect(master);
    pad.start();

    zoneMusicOscillators.push(pad);
    zoneMusicGains.push(padGain);

    // Occasional ambient tones
    const ambientNotes = [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.A4];
    let noteIdx = 0;

    const playTone = () => {
        if (!zoneMusicPlaying) return;
        if (Math.random() > 0.4) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = ambientNotes[noteIdx % ambientNotes.length];
        noteIdx++;

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

        osc.connect(gain);
        gain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2.5);
    };

    zoneMusicIntervals.push(setInterval(playTone, 4000));
};

export const isZoneMusicPlaying = () => zoneMusicPlaying;
export const getCurrentZoneMusicType = () => currentZoneMusicType;
