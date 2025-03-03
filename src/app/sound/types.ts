export interface PitchEnvelope {
  initialFreq: number;
  finalFreq: number;
  time: number;
}

export interface FilterParams {
  frequency: number;
  Q: number;
}

export interface SecondOscillator {
  type: OscillatorType;
  frequency: number;
  gain: number;
}

export interface Harmonic {
  freq?: number;
  ratio?: number;
  gain?: number;
}

export interface ControlsData {
  level: number;
  tone?: number;
  decay?: number;
  snappy?: number;
  reverb?: number;
  tuning?: number;
  // Agrega más propiedades si gustas
}

export interface SampleData {
  type?: OscillatorType;
  frequency?: number;
  decay?: number;
  volumeEnvelope?: [number, number];
  pitchEnvelope?: PitchEnvelope;
  isNoise?: boolean;
  noiseLevel?: number;
  isShiftedNoise?: boolean;
  bandpass?: FilterParams;
  highpass?: FilterParams;
  lowpass?: FilterParams;
  secondOscillator?: SecondOscillator;
  resonance?: number;
  multipleEnvelopes?: boolean;
  envelopeCount?: number;
  envelopeSpacing?: number;
  harmonics?: Harmonic[];
  controls?: ControlsData;
}

export interface StepButtonProps {
  stepIndex: number;
  isActive: boolean;
  isCurrent?: boolean;
  onClick: () => void;
}

export interface PadControlsProps {
  padName: string;
  controls: Record<string, number>;
  onControlChange: (padName: string, ctrl: string, value: number) => void;
}

export interface PadRowProps {
  padName: string;
  label: string;
  enabled: boolean;
  sequence: boolean[];
  currentStep: number;
  isPlaying: boolean;
  controls: Record<string, number>;
  onToggleStep: (padName: string, stepIndex: number) => void;
  onToggleEnabled: (padName: string) => void;
  onControlChange: (padName: string, ctrl: string, value: number) => void;
}
