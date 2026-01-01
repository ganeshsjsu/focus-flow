import * as Tone from 'tone';

// Musical Constants
const SCALES = {
    cmin: { // C Minor (Sad/Deep)
        root: "C3",
        notes: ["C3", "D3", "Eb3", "F3", "G3", "Ab3", "Bb3"],
        chords: [
            ["C3", "Eb3", "G3", "Bb3"], // i7
            ["Eb3", "G3", "Bb3", "D4"], // III7
            ["F3", "Ab3", "C4", "Eb4"], // iv7
            ["G3", "Bb3", "D4", "F4"],  // v7
            ["Ab3", "C4", "Eb4", "G4"], // VI7
            ["Bb3", "D4", "F4", "Ab4"]  // VII7
        ]
    },
    fdor: { // F Dorian (Groovy/Jazzy)
        root: "F3",
        notes: ["F3", "G3", "Ab3", "Bb3", "C4", "D4", "Eb4"],
        chords: [
            ["F3", "Ab3", "C4", "Eb4"], // i7
            ["G3", "Bb3", "D4", "F4"],  // ii7
            ["Ab3", "C4", "Eb4", "G4"], // III7
            ["Bb3", "D4", "F4", "Ab4"], // IV7
            ["C4", "Eb4", "G4", "Bb4"], // v7
            ["Eb4", "G4", "Bb4", "D5"]  // VII7
        ]
    },
    blyd: { // Bb Lydian (Dreamy/Floaty)
        root: "Bb3",
        notes: ["Bb3", "C4", "D4", "E4", "F4", "G4", "A4"],
        chords: [
            ["Bb3", "D4", "F4", "A4"],  // Imaj7
            ["C4", "E4", "G4", "Bb4"],  // II7
            ["D4", "F4", "A4", "C5"],   // iii7
            ["F4", "A4", "C5", "E5"]    // Vmaj7
        ]
    }
};

// Instrument Presets
export const INSTRUMENT_PRESETS = {
    keys: ["rhodes", "glass", "saw"],
    bass: ["sine", "reese"]
};

// Rhythm Modes
const RHYTHM_MODES = ["chill", "busy", "minimal"];

let currentScaleKey = 'cmin';

/**
 * Generates a completely new track configuration
 */
export const generateNewTrack = () => {
    // 1. Pick a Scale
    const scaleKeys = Object.keys(SCALES);
    currentScaleKey = scaleKeys[Math.floor(Math.random() * scaleKeys.length)];

    // 2. Pick Layout
    const keysPreset = INSTRUMENT_PRESETS.keys[Math.floor(Math.random() * INSTRUMENT_PRESETS.keys.length)];
    const bassPreset = INSTRUMENT_PRESETS.bass[Math.floor(Math.random() * INSTRUMENT_PRESETS.bass.length)];
    const rhythmMode = RHYTHM_MODES[Math.floor(Math.random() * RHYTHM_MODES.length)];

    return {
        scale: currentScaleKey,
        progression: generateChordProgression(currentScaleKey),
        drumPattern: generateDrumPattern(rhythmMode),
        presets: {
            keys: keysPreset,
            bass: bassPreset
        },
        rhythmMode
    };
};

/**
 * Generates a random 4-chord progression from the scale
 */
export const generateChordProgression = (scaleKey = 'cmin') => {
    const scale = SCALES[scaleKey];
    const progression = [];
    for (let i = 0; i < 4; i++) {
        const chord = scale.chords[Math.floor(Math.random() * scale.chords.length)];
        progression.push(chord);
    }
    return progression;
};

/**
 * Returns a simple drum pattern for a 1-bar loop (16 steps)
 * @param {string} mode - "chill" | "busy" | "minimal"
 */
export const generateDrumPattern = (mode = "chill") => {
    // Basic Lofi Beat Skeleton
    // One bar = 16 sixteenth notes
    let kick = [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0];
    let snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    let hihat = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0];

    if (mode === "minimal") {
        // Less is more
        kick = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        hihat = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
    } else if (mode === "busy") {
        // More ghost notes
        kick = [1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0];
        hihat = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // 16ths
    }

    // Add some random variation regardless of mode
    if (Math.random() > 0.5) {
        kick[10] = 0;
        kick[14] = 1;
    }

    return { kick, snare, hihat };
};

export const getScaleNotes = (scaleKey = 'cmin') => {
    return SCALES[scaleKey].notes;
};
