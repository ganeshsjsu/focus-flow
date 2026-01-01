import * as Tone from 'tone';
import { createKeys, createBass, createDrums, createPad } from './instruments';
import { generateChordProgression, generateDrumPattern, generateNewTrack } from './composer';

let isInitialized = false;
let instruments = {};
let currentChordProgression = [];
let drumPattern = { kick: [], snare: [], hihat: [] };

// Global effects
let masterLimiter;

export const initAudio = async () => {
    if (isInitialized) return;

    await Tone.start();
    Tone.Transport.bpm.value = 80; // Nice lofi tempo

    // 1. Setup Master Chain
    masterLimiter = new Tone.Limiter(-2).toDestination();

    // 2. Create Instruments
    const keys = createKeys();
    const bass = createBass();
    const drums = createDrums();
    const pad = createPad();

    // 3. Connect to Master
    keys.output.connect(masterLimiter);
    bass.output.connect(masterLimiter);
    drums.kick.output.connect(masterLimiter);
    drums.snare.output.connect(masterLimiter);
    drums.hihat.output.connect(masterLimiter);
    pad.output.connect(masterLimiter);

    instruments = {
        keys: keys.instrument,
        bass: bass.instrument,
        kick: drums.kick.instrument,
        snare: drums.snare.instrument,
        hihat: drums.hihat.instrument,
        pad: pad.instrument
    };

    // 4. Transport Loop
    let beatIndex = 0;
    let barIndex = 0; // 0 to 3 (4 bar loop)

    Tone.Transport.scheduleRepeat((time) => {
        const sixteenth = beatIndex % 16;

        // --- 1. Chords & Bass (Every Bar / 1st beat) ---
        if (sixteenth === 0) {
            // New progression every 4 bars? Or just loop one?
            // Let's generate a new one every 4 bars for variety
            if (barIndex === 0) {
                currentChordProgression = generateChordProgression();
                drumPattern = generateDrumPattern(); // switch up drums too
            }

            const currentChord = currentChordProgression[barIndex];

            // Play Chord
            instruments.keys.triggerAttackRelease(currentChord, "1m", time);

            // Play Pad (Lower volume, long release)
            instruments.pad.triggerAttackRelease(currentChord, "1m", time);

            // Play Bass (Root note of chord)
            const rootNote = currentChord[0]; // e.g. "C3"
            // Drop bass an octave? "C3" -> "C2"
            // Simple string manip or Tone.Frequency
            const bassNote = Tone.Frequency(rootNote).transpose(-12);
            instruments.bass.triggerAttackRelease(bassNote, "1m", time);

            // Increment Bar
            barIndex = (barIndex + 1) % 4;
        }

        // --- 2. Drums (Every 16th) ---
        if (drumPattern.kick[sixteenth]) {
            instruments.kick.triggerAttackRelease("C1", "8n", time);
        }
        if (drumPattern.snare[sixteenth]) {
            instruments.snare.triggerAttackRelease("8n", time);
        }
        if (drumPattern.hihat[sixteenth]) {
            instruments.hihat.triggerAttackRelease("32n", time, 0.2 + Math.random() * 0.3); // Velocity variation
        }

        beatIndex = (beatIndex + 1) % 16;

    }, "16n");

    isInitialized = true;
    console.log("Audio Engine Initialized");
};

export const play = async () => {
    if (!isInitialized) await initAudio();
    if (Tone.context.state !== 'running') await Tone.context.resume();
    Tone.Transport.start();

    // TIMEOUT FIX: Beep a silent osc every minute to keep the audio context alive?
    // Modern browsers throttle timers in background tabs. 
    // Tone.js uses AudioContext time which is robust, but the *scheduling* loop (setTimeout/requestAnimationFrame) might throttle.
    // Tone.Transport runs on the AudioContext clock, so it SHOULD be fine.
    // However, if the user says it times out, let's try a workaround:
    // Create a silent oscillator that plays constantly.
    if (!instruments.keepAlive) {
        instruments.keepAlive = new Tone.Oscillator(440, "sine").toDestination();
        instruments.keepAlive.volume.value = -Infinity; // Silent
        instruments.keepAlive.start();
    }
};

export const pause = () => {
    Tone.Transport.pause();
};

export const setIntensity = (level) => {
    // 0 to 1
    // Could adjust tempo or density
    // For now, simpler: adjust tempo
    const minBpm = 70;
    const maxBpm = 100;
    Tone.Transport.bpm.rampTo(minBpm + (level * (maxBpm - minBpm)), 2);
};

export const skipTrack = () => {
    // Generate completely new assets
    const newTrack = generateNewTrack();

    // 1. Dispose old instruments
    if (instruments.keys) instruments.keys.dispose();
    if (instruments.bass) instruments.bass.dispose();

    // 2. Create new instruments with presets
    console.log("Loading preset:", newTrack.presets);
    const keysNode = createKeys(newTrack.presets.keys);
    const bassNode = createBass(newTrack.presets.bass);

    // 3. Reconnect to Master
    keysNode.output.connect(masterLimiter);
    bassNode.output.connect(masterLimiter);

    // 4. Update References
    instruments.keys = keysNode.instrument;
    instruments.bass = bassNode.instrument;

    // 5. Apply musical changes
    currentChordProgression = newTrack.progression;
    drumPattern = newTrack.drumPattern;

    console.log(`Skipping to new vibe: ${newTrack.scale} | Keys: ${newTrack.presets.keys} | Bass: ${newTrack.presets.bass}`);
};
