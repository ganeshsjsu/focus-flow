import * as Tone from 'tone';

/**
 * Creates a mellow, lofi-style electric piano (Rhodes-ish).
 * Uses a PolySynth with sine waves and a chorus effect.
 * @param {string} type - "rhodes" | "glass" | "saw"
 */
export const createKeys = (type = "rhodes") => {
  let keys;
  let filter;
  let effects = [];

  if (type === "glass") {
    // FM Synthesis for bells
    keys = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3,
      modulationIndex: 3.5,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 2
      },
      modulation: { type: "triangle" },
      modulationEnvelope: {
        attack: 0.002,
        decay: 0.2,
        sustain: 0,
        release: 0.2
      },
      volume: -10
    });
    filter = new Tone.Filter(3000, "lowpass");
    effects.push(new Tone.Reverb(2).toDestination()); // Extra reverb
  } else if (type === "saw") {
    // Retro Synthwave
    keys = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      },
      volume: -10
    });
    filter = new Tone.Filter(800, "lowpass");
    effects.push(new Tone.Chorus(2, 3, 0.5));
  } else {
    // Default: Rhodes
    keys = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1.5
      },
      volume: -6
    });
    filter = new Tone.Filter(2000, "lowpass");
    effects.push(new Tone.Chorus(2, 2.5, 0.5));
  }

  // Chain effects but do NOT connect to Destination yet (engine will handle mixing)
  // We return the output node of the chain
  // Wait, chaining multiple effects is tricky with `chain`.
  // Let's keep it simple: instrument -> chorus -> filter -> output

  if (effects.length > 0) {
    keys.chain(...effects, filter);
  } else {
    keys.connect(filter);
  }

  return {
    instrument: keys,
    output: filter // Return the last node in the chain
  };
};

/**
 * Creates a bass synth.
 * @param {string} type - "sine" | "reese"
 */
export const createBass = (type = "sine") => {
  let bass;

  if (type === "reese") {
    // Detuned saw waves
    bass = new Tone.MonoSynth({
      oscillator: { type: "sawtooth" },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.8,
        release: 1
      },
      filterEnvelope: {
        attack: 0.05,
        decay: 0.5,
        sustain: 0.5,
        baseFrequency: 200,
        octaves: 2.5
      },
      volume: -10
    });
    // A reese needs chorus to sound wide and detuned
    const chorus = new Tone.Chorus(4, 2.5, 0.5).start();
    bass.connect(chorus);
    return { instrument: bass, output: chorus };
  }

  // Default: Sine Sub
  bass = new Tone.MonoSynth({
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.5,
      baseFrequency: 100,
      octaves: 2
    },
    volume: -4
  });

  return {
    instrument: bass,
    output: bass
  };
};

/**
 * Creates the lofi drum kit.
 */
export const createDrums = () => {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
      attackCurve: "exponential"
    },
    volume: -2
  });

  const snare = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.0,
    },
    volume: -10
  });

  // Add a bit of reverb to the snare for that "lofi" space
  const snarePanner = new Tone.Panner(0);

  const hihat = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.05,
      release: 0.05
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
    volume: -15
  });

  return {
    kick: { instrument: kick, output: kick },
    snare: { instrument: snare, output: snare },
    hihat: { instrument: hihat, output: hihat }
  };
};

export const createPad = () => {
  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
      attack: 2,
      decay: 1,
      sustain: 0.8,
      release: 4
    },
    volume: -12
  });

  const chorus = new Tone.Chorus(2, 3, 0.5).start();
  const tremolo = new Tone.Tremolo(4, 0.5).start();
  const filter = new Tone.Filter(800, "lowpass");

  pad.chain(chorus, tremolo, filter);

  return {
    instrument: pad,
    output: filter
  };
};
