import { SampleData } from "./types";

export const padColors: Record<string, string> = {
  kick: "bg-orange-700",
  snare: "bg-red-600",
  hihat: "bg-yellow-600",
  openhat: "bg-yellow-500",
  clap: "bg-orange-500",
  tom: "bg-red-700",
  crash: "bg-amber-500",
  cowbell: "bg-orange-600",
  rimshot: "bg-red-500",
  clave: "bg-amber-600",
  maracas: "bg-orange-400",
};

export const keyMap: Record<string, string> = {
  "1": "kick",
  "2": "snare",
  "3": "hihat",
  "4": "openhat",
  "5": "clap",
  "6": "tom",
  "7": "crash",
  "8": "cowbell",
  "9": "rimshot",
  "0": "clave",
  "-": "maracas",
};

export const pads = [
  { name: "kick", label: "KICK (1)", playKey: "1" },
  { name: "snare", label: "SNARE (2)", playKey: "2" },
  { name: "hihat", label: "HI-HAT (3)", playKey: "3" },
  { name: "openhat", label: "OPEN HAT (4)", playKey: "4" },
  { name: "clap", label: "CLAP (5)", playKey: "5" },
  { name: "tom", label: "TOM (6)", playKey: "6" },
  { name: "crash", label: "CRASH (7)", playKey: "7" },
  { name: "cowbell", label: "COWBELL (8)", playKey: "8" },
  { name: "rimshot", label: "RIMSHOT (9)", playKey: "9" },
  { name: "clave", label: "CLAVE (0)", playKey: "0" },
  { name: "maracas", label: "MARACAS (-)", playKey: "-" },
];

export const SAMPLE_ROLAND_TR_808: Record<string, SampleData> = {
  kick: {
    type: "sine",
    frequency: 43,
    decay: 0.85,
    volumeEnvelope: [1, 0.001],
    pitchEnvelope: {
      initialFreq: 160,
      finalFreq: 43,
      time: 0.07,
    },
    controls: {
      level: 0.85,
      tone: 0.5,
      decay: 0.55,
    },
  },
  snare: {
    type: "triangle",
    frequency: 175,
    decay: 0.23,
    noiseLevel: 0.85,
    bandpass: {
      frequency: 1100,
      Q: 1.9,
    },
    volumeEnvelope: [1, 0.001],
    controls: {
      level: 0.8,
      tone: 0.5,
      snappy: 0.65,
    },
  },
  hihat: {
    isNoise: true,
    bandpass: {
      frequency: 9200,
      Q: 3.2,
    },
    highpass: {
      frequency: 7000,
      Q: 1.2,
    },
    decay: 0.035,
    volumeEnvelope: [0.8, 0.001],
    controls: {
      level: 0.72,
      tone: 0.5,
      decay: 0.15,
    },
  },
  openhat: {
    isNoise: true,
    bandpass: {
      frequency: 9000,
      Q: 2.8,
    },
    highpass: {
      frequency: 6800,
      Q: 1.3,
    },
    decay: 0.5,
    volumeEnvelope: [0.75, 0.001],
    controls: {
      level: 0.7,
      tone: 0.5,
      decay: 0.65,
    },
  },
  clap: {
    isNoise: true,
    bandpass: {
      frequency: 1500,
      Q: 1.8,
    },
    multipleEnvelopes: true,
    envelopeCount: 5,
    envelopeSpacing: 0.0055,
    decay: 0.25,
    volumeEnvelope: [0.7, 0.001],
    controls: {
      level: 0.65,
      tone: 0.5,
      reverb: 0.25,
    },
  },
  tom: {
    type: "sine",
    frequency: 85,
    decay: 0.35,
    volumeEnvelope: [0.85, 0.001],
    pitchEnvelope: {
      initialFreq: 135,
      finalFreq: 60,
      time: 0.08,
    },
    controls: {
      level: 0.8,
      tuning: 0.5,
      decay: 0.5,
    },
  },
  crash: {
    isNoise: true,
    highpass: {
      frequency: 5500,
      Q: 0.7,
    },
    lowpass: {
      frequency: 13000,
      Q: 0.6,
    },
    resonance: 0.3,
    decay: 1.8,
    volumeEnvelope: [0.9, 0.001],
    controls: {
      level: 0.75,
      tone: 0.5,
      decay: 0.7,
    },
  },
  cowbell: {
    type: "square",
    frequency: 845,
    secondOscillator: {
      type: "square",
      frequency: 565,
      gain: 0.45,
    },
    bandpass: {
      frequency: 845,
      Q: 4.2,
    },
    decay: 0.43,
    volumeEnvelope: [0.65, 0.001],
    controls: {
      level: 0.65,
      tone: 0.5,
      decay: 0.5,
    },
  },
  rimshot: {
    type: "sine",
    frequency: 1850,
    harmonics: [
      {
        freq: 3700,
        gain: 0.25,
      },
    ],
    noiseLevel: 0.2,
    bandpass: {
      frequency: 3200,
      Q: 8.5,
    },
    decay: 0.045,
    volumeEnvelope: [1, 0.001],
    controls: {
      level: 0.85,
      tone: 0.5,
      snappy: 0.5,
    },
  },
  clave: {
    type: "sine",
    frequency: 2550,
    harmonics: [
      {
        ratio: 3.2,
        gain: 0.22,
      },
      {
        ratio: 5.4,
        gain: 0.12,
      },
    ],
    decay: 0.055,
    volumeEnvelope: [0.9, 0.001],
    controls: {
      level: 0.85,
      tone: 0.5,
      decay: 0.15,
    },
  },
  maracas: {
    isNoise: true,
    highpass: {
      frequency: 7200,
      Q: 2.5,
    },
    lowpass: {
      frequency: 12000,
      Q: 1.2,
    },
    isShiftedNoise: true,
    decay: 0.045,
    volumeEnvelope: [0.6, 0.001],
    controls: {
      level: 0.55,
      tone: 0.5,
      decay: 0.17,
    },
  },
};
