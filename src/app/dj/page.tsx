"use client";
import React, { useEffect, useRef, useState } from "react";

const frequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

const AudioEqualizer: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gainValues, setGainValues] = useState(Array(10).fill(0));

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const setupAudio = (file: File) => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = new AudioContext();
    const audio = new Audio(URL.createObjectURL(file));
    audio.controls = true;
    audioRef.current = audio;

    const source = audioContextRef.current.createMediaElementSource(audio);
    const eqFilters: BiquadFilterNode[] = [];

    let previousNode: AudioNode = source;
    frequencies.forEach((freq, index) => {
      const filter = audioContextRef.current!.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = gainValues[index];
      eqFilters.push(filter);
      previousNode.connect(filter);
      previousNode = filter;
    });

    previousNode.connect(audioContextRef.current.destination);
    filtersRef.current = eqFilters;

    document.getElementById("audio-container")?.appendChild(audio);
    drawCurve();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setupAudio(event.target.files[0]);
    }
  };

  const handleGainChange = (index: number, value: number) => {
    setGainValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });

    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = value;
    }

    drawCurve();
  };

  const drawCurve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    ctx.strokeStyle = "#4bc0c0";
    ctx.lineWidth = 3;

    for (let i = 0; i < frequencies.length - 1; i++) {
      const x1 = (i / (frequencies.length - 1)) * canvas.width;
      const y1 = canvas.height / 2 - gainValues[i] * (canvas.height / 30);
      const x2 = ((i + 1) / (frequencies.length - 1)) * canvas.width;
      const y2 = canvas.height / 2 - gainValues[i + 1] * (canvas.height / 30);

      const xc = (x1 + x2) / 2;
      const yc = (y1 + y2) / 2;

      if (i === 0) {
        ctx.moveTo(x1, y1);
      }
      ctx.quadraticCurveTo(x1, y1, xc, yc);
    }

    ctx.stroke();
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-xl text-blue-300 font-bold mb-4">Ecualizador Paramétrico</h1>
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/mp3"
        onChange={handleFileChange}
        className="mb-4"
      />
      <div id="audio-container" className="mb-4"></div>

      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="border border-gray-400 mb-4 mx-auto"
      />

      <div className="flex flex-row items-start justify-center gap-2">
        {frequencies.map((freq, index) => (
          <div key={freq} className="flex flex-col items-center bg-blue-400 w-[80px] h-[200px]">
            <span className="text-xs mb-1">{freq} Hz</span>
            <input
              type="range"
              min="-30"
              max="30"
              step="0.5"
              value={gainValues[index]}
              onChange={(e) =>
                handleGainChange(index, parseFloat(e.target.value))
              }
              className="h-40"
              style={{ writingMode: "vertical-lr", direction: "rtl" }}
            />
            <span className="text-xs mt-1">{gainValues[index]} dB</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioEqualizer;
