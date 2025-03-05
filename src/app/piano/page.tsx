"use client";

import { useEffect, useCallback, useState } from "react";

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

const activeOscillators = new Map<
  string,
  { oscillator: OscillatorNode; gainNode: GainNode }
>();

const startSound = (key: string, frequency: number) => {
  if (activeOscillators.has(key)) return;

  const audioContext = AudioContextSingleton.getInstance();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();

  activeOscillators.set(key, { oscillator, gainNode });
};

const stopSound = (key: string) => {
  const sound = activeOscillators.get(key);
  if (sound) {
    sound.gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      sound.gainNode.context.currentTime + 0.3
    );
    setTimeout(() => {
      sound.oscillator.stop();
      sound.oscillator.disconnect();
      sound.gainNode.disconnect();
      activeOscillators.delete(key);
    }, 300);
  }
};

const scales = [
  {
    name: "Escala baja",
    keys: "1234567",
    notes: [
      { frequency: 130.81 },
      { frequency: 146.83 },
      { frequency: 164.81 },
      { frequency: 174.61 },
      { frequency: 196.0 },
      { frequency: 220.0 },
      { frequency: 246.94 },
    ],
  },
  {
    name: "Escala media",
    keys: "qwertyu",
    notes: [
      { frequency: 261.63 },
      { frequency: 293.66 },
      { frequency: 329.63 },
      { frequency: 349.23 },
      { frequency: 392.0 },
      { frequency: 440.0 },
      { frequency: 493.88 },
    ],
  },
  {
    name: "Escala alta",
    keys: "asdfghj",
    notes: [
      { frequency: 523.25 },
      { frequency: 587.33 },
      { frequency: 659.25 },
      { frequency: 698.46 },
      { frequency: 783.99 },
      { frequency: 880.0 },
      { frequency: 987.77 },
    ],
  },
];

const Piano = () => {
  const [activeKeys, setActiveKeys] = useState(new Set<string>());

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (activeKeys.has(event.key.toLowerCase())) return;

      scales.forEach((scale) => {
        const index = scale.keys.indexOf(event.key.toLowerCase());
        if (index !== -1) {
          startSound(event.key.toLowerCase(), scale.notes[index].frequency);
          setActiveKeys((prev) => new Set([...prev, event.key.toLowerCase()]));
        }
      });
    },
    [activeKeys]
  );

  const handleKeyRelease = useCallback((event: KeyboardEvent) => {
    stopSound(event.key.toLowerCase());
    setActiveKeys((prev) => {
      const newKeys = new Set(prev);
      newKeys.delete(event.key.toLowerCase());
      return newKeys;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [handleKeyPress, handleKeyRelease]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {scales.map((scale) => (
        <div key={scale.name} className="flex gap-2">
          {scale.keys.split("").map((key, index) => (
            <button
              key={key}
              onMouseDown={() => startSound(key, scale.notes[index].frequency)}
              onMouseUp={() => stopSound(key)}
              onMouseLeave={() => stopSound(key)}
              data-enabled={activeKeys.has(key) ? "true" : "false"}
              className="w-12 h-24 text-blue-900 bg-white border border-gray-500 rounded shadow-md active:bg-gray-300 data-[enabled=true]:bg-blue-400"
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Piano;
