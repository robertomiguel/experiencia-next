"use client";

const playSound = (
  frequencies: number[],
  type: OscillatorType = "sine",
  duration: number = 1
) => {
  const audioCtx = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
  gainNode.connect(audioCtx.destination);

  frequencies.forEach((frequency, index) => {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
      frequency,
      audioCtx.currentTime + index * 0.2
    );
    oscillator.connect(gainNode);
    oscillator.start(audioCtx.currentTime + index * 0.2);
    oscillator.stop(audioCtx.currentTime + index * 0.2 + duration);
  });

  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + duration + frequencies.length * 0.2
  );
};

const sounds: {
  label: string;
  frequencies: number[];
  type: OscillatorType;
  duration: number;
}[] = [
  { label: "Do", frequencies: [261], type: "sine", duration: 1 },
  { label: "Re", frequencies: [293], type: "sine", duration: 1 },
  { label: "Mi", frequencies: [329], type: "sine", duration: 1 },
  { label: "Fa", frequencies: [349], type: "sine", duration: 1 },
  { label: "Sol", frequencies: [392], type: "sine", duration: 1 },
  { label: "La", frequencies: [440], type: "sine", duration: 1 },
  { label: "Si", frequencies: [493], type: "sine", duration: 1 },
  {
    label: "Alerta",
    frequencies: [600, 750, 900],
    type: "triangle",
    duration: 0.6,
  },
  {
    label: "Eliminar",
    frequencies: [300, 250, 200, 150, 100],
    type: "sawtooth",
    duration: 1.2,
  },
  {
    label: "Notificación",
    frequencies: [1000, 1200, 1400],
    type: "sine",
    duration: 0.7,
  },
  {
    label: "Éxito",
    frequencies: [500, 700, 900, 1100],
    type: "sine",
    duration: 1,
  },
  {
    label: "Error",
    frequencies: [200, 300, 250],
    type: "square",
    duration: 0.6,
  },
  {
    label: "Advertencia",
    frequencies: [700, 650, 600],
    type: "triangle",
    duration: 0.8,
  },
  {
    label: "Tristeza",
    frequencies: [400, 350, 300],
    type: "sine",
    duration: 1.5,
  },
  {
    label: "Alegría",
    frequencies: [900, 1100, 1300],
    type: "triangle",
    duration: 1,
  },
  {
    label: "Suspenso",
    frequencies: [200, 250, 300, 350],
    type: "sawtooth",
    duration: 2,
  },
  {
    label: "Terror",
    frequencies: [150, 180, 200],
    type: "square",
    duration: 2.5,
  },
  {
    label: "Organo",
    frequencies: [500, 700, 900, 1200, 1500],
    type: "sine",
    duration: 2,
  },
  {
    label: "Placer",
    frequencies: [600, 800, 1000],
    type: "triangle",
    duration: 1.8,
  },
  {
    label: "Rechazo",
    frequencies: [250, 200, 150],
    type: "square",
    duration: 1,
  },
  {
    label: "Aceptar",
    frequencies: [900, 1100, 1300],
    type: "sine",
    duration: 0.7,
  },
  {
    label: "Cancelar",
    frequencies: [400, 350, 300],
    type: "sawtooth",
    duration: 0.8,
  },
  {
    label: "Inicio de sesión",
    frequencies: [261, 329, 392, 523],
    type: "sine",
    duration: 1.5,
  },
  {
    label: "Cierre de sesión",
    frequencies: [1200, 900, 600],
    type: "triangle",
    duration: 1.2,
  },
  {
    label: "Popup",
    frequencies: [800, 1000, 1200],
    type: "sine",
    duration: 0.5,
  },
  {
    label: "Bienvenida",
    frequencies: [400, 600, 800, 1000, 1200],
    type: "sine",
    duration: 2.5,
  },
];

const Page = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        padding: "20px",
      }}
    >
      {sounds.map(({ label, frequencies, type, duration }) => (
        <button
          key={label}
          onClick={() =>
            playSound(frequencies, type as OscillatorType, duration)
          }
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
            width: 'fit-content',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Page;
