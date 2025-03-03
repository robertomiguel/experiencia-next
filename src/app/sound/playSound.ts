import { SampleData } from "./types";

const AudioContextSingleton = (() => {
  let instance: AudioContext | null = null;
  return {
    getInstance: () => {
      if (!instance) {
        instance = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      return instance;
    },
  };
})();

function cleanupVoice(voice: { nodes: AudioNode[] }) {
  voice.nodes.forEach((node) => {
    try {
      node.disconnect && node.disconnect();
    } catch {
      // Ignore disconnect errors
    }
  });
  const idx = activeVoices.indexOf(voice);
  if (idx >= 0) {
    activeVoices.splice(idx, 1);
  }
}

const activeVoices: Array<{
  nodes: AudioNode[];
}> = [];

const MAX_VOICES = 32;

function killOldestVoice() {
  const oldest = activeVoices[0];
  if (oldest) {
    cleanupVoice(oldest);
  }
}

export function playSound(sampleData: SampleData) {
  if (!sampleData) return;

  if (activeVoices.length >= MAX_VOICES) {
    killOldestVoice();
  }

  const audioContext = AudioContextSingleton.getInstance();
  const now = audioContext.currentTime;

  const voice = { nodes: [] as AudioNode[] };

  // Gain principal
  const gainNode = audioContext.createGain();
  voice.nodes.push(gainNode);
  gainNode.connect(audioContext.destination);

  const level = sampleData.controls?.level ?? 1;
  gainNode.gain.value = level;

  // Fuente principal
  let sourceNode: AudioBufferSourceNode | OscillatorNode;
  if (sampleData.isNoise) {
    // Ruido
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] =
        (Math.random() * 2 - 1) * (sampleData.isShiftedNoise ? 0.8 : 1);
    }
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = noiseBuffer;
    sourceNode = bufferSource;
  } else {
    // Oscilador
    const osc = audioContext.createOscillator();
    osc.type = sampleData.type || "sine";
    osc.frequency.setValueAtTime(sampleData.frequency || 100, now);

    if (sampleData.pitchEnvelope) {
      const { initialFreq, finalFreq, time } = sampleData.pitchEnvelope;
      osc.frequency.setValueAtTime(initialFreq, now);
      osc.frequency.exponentialRampToValueAtTime(finalFreq, now + time);
    }
    sourceNode = osc;
  }
  voice.nodes.push(sourceNode);

  // Filtros
  let lastNode: AudioNode = sourceNode;
  if (sampleData.bandpass) {
    const bp = audioContext.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = sampleData.bandpass.frequency;
    bp.Q.value = sampleData.bandpass.Q;
    voice.nodes.push(bp);
    lastNode.connect(bp);
    lastNode = bp;
  }
  if (sampleData.highpass) {
    const hp = audioContext.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = sampleData.highpass.frequency;
    hp.Q.value = sampleData.highpass.Q;
    voice.nodes.push(hp);
    lastNode.connect(hp);
    lastNode = hp;
  }
  if (sampleData.lowpass) {
    const lp = audioContext.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = sampleData.lowpass.frequency;
    lp.Q.value = sampleData.lowpass.Q;
    voice.nodes.push(lp);
    lastNode.connect(lp);
    lastNode = lp;
  }

  // Oscilador secundario (cowbell, etc.)
  if (sampleData.secondOscillator) {
    const { type, frequency, gain } = sampleData.secondOscillator;
    const osc2 = audioContext.createOscillator();
    osc2.type = type;
    osc2.frequency.setValueAtTime(frequency, now);
    const osc2Gain = audioContext.createGain();
    osc2Gain.gain.value = gain || 0.5;
    voice.nodes.push(osc2, osc2Gain);

    osc2.connect(osc2Gain).connect(gainNode);
    osc2.start(now);
    osc2.stop(now + (sampleData.decay || 0.3));
  }

  // Armónicos
  if (sampleData.harmonics && !sampleData.isNoise) {
    sampleData.harmonics.forEach((harmonic) => {
      const oscH = audioContext.createOscillator();
      oscH.type = sampleData.type || "sine";
      if (harmonic.freq) {
        oscH.frequency.setValueAtTime(harmonic.freq, now);
      } else if (harmonic.ratio) {
        const baseFreq = sampleData.frequency || 100;
        oscH.frequency.setValueAtTime(baseFreq * harmonic.ratio, now);
      }
      const oscGain = audioContext.createGain();
      oscGain.gain.value = harmonic.gain ?? 0.2;
      voice.nodes.push(oscH, oscGain);
      oscH.connect(oscGain).connect(gainNode);

      oscH.start(now);
      oscH.stop(now + (sampleData.decay || 0.3));
    });
  }

  // Ruido adicional (snare, etc.) si no es "isNoise"
  if (sampleData.noiseLevel && !sampleData.isNoise) {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    voice.nodes.push(noiseSource);

    let noiseNode: AudioNode = noiseSource;
    if (sampleData.bandpass) {
      const bp2 = audioContext.createBiquadFilter();
      bp2.type = "bandpass";
      bp2.frequency.value = sampleData.bandpass.frequency;
      bp2.Q.value = sampleData.bandpass.Q;
      voice.nodes.push(bp2);
      noiseNode.connect(bp2);
      noiseNode = bp2;
    }
    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = sampleData.noiseLevel;
    voice.nodes.push(noiseGain);

    noiseNode.connect(noiseGain).connect(gainNode);
    noiseSource.start(now);
    noiseSource.stop(now + (sampleData.decay || 0.3));
  }

  // Conectar al gain final
  lastNode.connect(gainNode);

  // Envolvente
  const [startVol, endVol] = sampleData.volumeEnvelope || [1, 0.001];
  gainNode.gain.setValueAtTime(level * startVol, now);
  gainNode.gain.exponentialRampToValueAtTime(
    level * endVol,
    now + (sampleData.decay || 0.3)
  );

  const endTime = now + (sampleData.decay || 0.3);
  if ("start" in sourceNode) {
    sourceNode.start(now);
    sourceNode.stop(endTime);
  }

  activeVoices.push(voice);
  const cleanupDelay = Math.max(
    0,
    (endTime - audioContext.currentTime) * 1000 + 50
  );
  setTimeout(() => {
    cleanupVoice(voice);
  }, cleanupDelay);
}
