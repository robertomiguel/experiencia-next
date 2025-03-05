/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";

const BOARD_WIDTH = typeof window === 'undefined' ? 0 : Math.min(window.innerWidth, 1000);
const BOARD_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 20; // Pelota más pequeña para mejor jugabilidad
const BASE_SPEED = 5;
const BOARD_COLOR = "black";
const AI_PADDLE_COLOR = "red";
const PLAYER_PADDLE_COLOR = "blue";
const BALL_COLOR = "white";

const Page = () => {
  const [ball, setBall] = useState({ 
    x: BOARD_WIDTH / 2 - BALL_SIZE / 2, 
    y: PADDLE_HEIGHT + BALL_SIZE / 2, 
    dx: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1), 
    dy: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1)
  });
  const [playerX, setPlayerX] = useState(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [aiX, setAiX] = useState(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [score, setScore] = useState({ ai: 0, player: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Función para calcular el rebote en la paleta
  const calculatePaddleRebound = (ballX: any, paddleX: any, isPlayerPaddle: any) => {
    // Calcula dónde golpeó la pelota en la paleta (de -1 a 1, donde 0 es el centro)
    const hitPosition = (ballX + BALL_SIZE / 2 - paddleX - PADDLE_WIDTH / 2) / (PADDLE_WIDTH / 2);
    
    // Calcula el ángulo de rebote (máximo 60 grados)
    const maxAngle = Math.PI / 3; // 60 grados en radianes
    const angle = hitPosition * maxAngle;
    
    // Calcula la nueva velocidad
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    const newDx = Math.sin(angle) * speed;
    
    // Dirección vertical depende de si es la paleta del jugador o de la IA
    const newDy = isPlayerPaddle ? -Math.abs(Math.cos(angle) * speed) : Math.abs(Math.cos(angle) * speed);
    
    return { dx: newDx, dy: newDy };
  };

  useEffect(() => {
    // Manejo de mouse para escritorio
    const handleMouseMove = (e: MouseEvent) => {
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        let newX = e.clientX - rect.left - PADDLE_WIDTH / 2;
        newX = Math.max(0, Math.min(newX, BOARD_WIDTH - PADDLE_WIDTH));
        setPlayerX(newX);
      }
    };

    // Para dispositivos móviles, usamos una implementación más directa
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && gameRef.current) {
        e.preventDefault(); // Prevenir scroll
        
        const touch = e.touches[0];
        const rect = gameRef.current.getBoundingClientRect();
        
        // Calcular posición absoluta, no relativa
        let newX = touch.clientX - rect.left - PADDLE_WIDTH / 2;
        newX = Math.max(0, Math.min(newX, BOARD_WIDTH - PADDLE_WIDTH));
        
        setPlayerX(newX);
      }
    };
    
    // Agregar event listeners para escritorio
    window.addEventListener("mousemove", handleMouseMove);
    
    // Agregar event listeners para móviles (en todo el documento)
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    
    // Limpiar event listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    
    const updateGame = () => {
      setBall((prev) => {
        let { x, y, dx, dy } = prev;
        
        // Calcular siguiente posición
        let nextX = x + dx;
        let nextY = y + dy;
        
        // Manejo de colisión con paredes laterales
        if (nextX <= 0) {
          nextX = 0;
          dx = Math.abs(dx);
        } else if (nextX >= BOARD_WIDTH - BALL_SIZE) {
          nextX = BOARD_WIDTH - BALL_SIZE;
          dx = -Math.abs(dx);
        }
        
        // Colisión con paleta del jugador (abajo)
        if (dy > 0 && // Solo si va hacia abajo
            nextY + BALL_SIZE >= BOARD_HEIGHT - PADDLE_HEIGHT &&
            nextY < BOARD_HEIGHT &&
            nextX + BALL_SIZE > playerX &&
            nextX < playerX + PADDLE_WIDTH) {
          
          // Calcula rebote basado en dónde golpeó la paleta
          const reboundVector = calculatePaddleRebound(nextX, playerX, true);
          dx = reboundVector.dx;
          dy = reboundVector.dy;
          
          // Ajusta posición para evitar solapamiento
          nextY = BOARD_HEIGHT - PADDLE_HEIGHT - BALL_SIZE;
        }
        
        // Colisión con paleta de la IA (arriba)
        if (dy < 0 && // Solo si va hacia arriba
            nextY <= PADDLE_HEIGHT &&
            nextY + BALL_SIZE > 0 &&
            nextX + BALL_SIZE > aiX &&
            nextX < aiX + PADDLE_WIDTH) {
          
          // Calcula rebote
          const reboundVector = calculatePaddleRebound(nextX, aiX, false);
          dx = reboundVector.dx;
          dy = reboundVector.dy;
          
          // Ajusta posición
          nextY = PADDLE_HEIGHT;
        }
        
        // Punto para jugador (pelota sale por arriba)
        if (nextY + BALL_SIZE < 0) {
          setScore((prev) => ({ ...prev, player: prev.player + 1 }));
          return { 
            x: BOARD_WIDTH / 2 - BALL_SIZE / 2, 
            y: BOARD_HEIGHT / 2 - BALL_SIZE / 2, 
            dx: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1), 
            dy: BASE_SPEED // Siempre hacia abajo después de un punto
          };
        }
        
        // Punto para la IA (pelota sale por abajo)
        if (nextY > BOARD_HEIGHT) {
          setScore((prev) => ({ ...prev, ai: prev.ai + 1 }));
          return { 
            x: BOARD_WIDTH / 2 - BALL_SIZE / 2, 
            y: BOARD_HEIGHT / 2 - BALL_SIZE / 2, 
            dx: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1), 
            dy: -BASE_SPEED // Siempre hacia arriba después de un punto
          };
        }
        
        return { x: nextX, y: nextY, dx, dy };
      });

      // Movimiento de la IA (con limitación de velocidad para hacerlo más justo)
      setAiX((prev) => {
        // El objetivo es el centro de la pelota
        const targetX = ball.x + BALL_SIZE / 2 - PADDLE_WIDTH / 2;
        
        // Distancia al objetivo
        const distance = targetX - prev;
        
        // Limitar la velocidad máxima de la IA
        const maxSpeed = 6;
        const speed = Math.min(Math.abs(distance) * 0.1, maxSpeed);
        
        // Movimiento suavizado
        return prev + (distance > 0 ? speed : -speed);
      });
      
      animationRef.current = requestAnimationFrame(updateGame);
    };

    animationRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, playerX, aiX, calculatePaddleRebound]);

  const handleReset = () => {
    setBall({ 
      x: BOARD_WIDTH / 2 - BALL_SIZE / 2, 
      y: BOARD_HEIGHT / 2 - BALL_SIZE / 2, 
      dx: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1), 
      dy: BASE_SPEED * (Math.random() > 0.5 ? 1 : -1)
    });
    setScore({ ai: 0, player: 0 });
    setIsRunning(true);
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-[1000px] mx-auto mt-10">
      <div className="text-white text-xl font-bold mb-2">
        <span style={{ color: AI_PADDLE_COLOR }}>IA {score.ai}</span> - <span style={{ color: PLAYER_PADDLE_COLOR }}> {score.player} Human</span>
      </div>
      <div ref={gameRef} className="relative w-full" style={{ height: BOARD_HEIGHT, backgroundColor: BOARD_COLOR }}>
        
        {/* Paletas */}
        <div className="absolute top-0" style={{ 
          width: PADDLE_WIDTH, 
          height: PADDLE_HEIGHT, 
          backgroundColor: AI_PADDLE_COLOR, 
          left: `${aiX}px` 
        }} />
        <div className="absolute bottom-0" style={{ 
          width: PADDLE_WIDTH, 
          height: PADDLE_HEIGHT, 
          backgroundColor: PLAYER_PADDLE_COLOR, 
          left: `${playerX}px` 
        }} />
        
        {/* Pelota */}
        <div className="absolute rounded-full" style={{ 
          width: BALL_SIZE, 
          height: BALL_SIZE, 
          backgroundColor: BALL_COLOR, 
          left: `${ball.x}px`, 
          top: `${ball.y}px` 
        }} />
      </div>
      
      <div className="mt-4 flex gap-4">
        {!isRunning && (
          <button 
            className="px-6 py-2 bg-white text-black font-bold rounded" 
            onClick={() => setIsRunning(true)}
          >
            Iniciar
          </button>
        )}
        {isRunning && (
          <button 
            className="px-6 py-2 bg-white text-black font-bold rounded" 
            onClick={() => setIsRunning(false)}
          >
            Pausa
          </button>
        )}
        <button 
          className="px-6 py-2 bg-white text-black font-bold rounded" 
          onClick={handleReset}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
};

export default Page;