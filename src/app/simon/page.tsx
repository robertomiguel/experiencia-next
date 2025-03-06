'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

const colors = ['red', 'green', 'blue', 'yellow'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const playSound = (color: string) => {
  if (!(window as any).audioCtx) {
    (window as any).audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  const audioCtx = (window as any).audioCtx;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  const frequencies: Record<string, number> = {
    red: 261.6,
    green: 329.6,
    blue: 392.0,
    yellow: 523.3,
  };

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequencies[color], audioCtx.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 300);
};

const ColorButton = React.memo(({ color, onClick, active }: { color: string; onClick: () => void; active: boolean }) => (
  <button
    className={`w-24 h-24 rounded-lg transition-transform transform ${color} ${active ? 'scale-125 opacity-100 shadow-lg' : 'opacity-50'}`}
    onClick={onClick}
  />
));

ColorButton.displayName = 'ColorButton';

export default function Page() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSequence = useCallback(() => {
    setIsUserTurn(false);
    let i = 0;
    const interval = setInterval(() => {
      const color = sequence[i];
      setActiveColor(color);
      playSound(color);
      setTimeout(() => setActiveColor(null), 500);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => setIsUserTurn(true), 500);
      }
    }, 1000);
  }, [sequence]);

  useEffect(() => {
    if (sequence.length > 0) playSequence();
  }, [sequence, playSequence]);

  const handleColorClick = (color: string) => {
    if (!isUserTurn) return;
    playSound(color);
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 300);
    const newUserInput = [...userInput, color];
    setUserInput(newUserInput);
    if (newUserInput.join('') === sequence.slice(0, newUserInput.length).join('')) {
      if (newUserInput.length === sequence.length) {
        setTimeout(() => {
          setSequence((prev) => [...prev, getRandomColor()]);
          setUserInput([]);
        }, 500);
      }
    } else {
      setSequence([]);
      setUserInput([]);
      setIsPlaying(false);
      alert('Game Over!');
    }
  };

  const startGame = () => {
    setSequence([getRandomColor()]);
    setUserInput([]);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <ColorButton key={color} color={`bg-${color}-500`} onClick={() => handleColorClick(color)} active={activeColor === color} />
        ))}
      </div>
      {!isPlaying && <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={startGame}>Start Game</button>}
    </div>
  );
}
