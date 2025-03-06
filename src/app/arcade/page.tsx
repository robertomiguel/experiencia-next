"use client";

import { useEffect, useRef, useState } from "react";

/** Constantes de juego */
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ENEMY_SPEED = 2;
const ENEMY_MOVE_RANGE = 2; // movimiento horizontal de la nave enemiga
const ENEMY_SIZE = 30;
const PLAYER_SIZE = 30;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const SPAWN_INTERVAL = 1000; // ms entre spawns de enemigos

// Detección de colisión (bounding box)
function detectCollision(
  bullet: { x: number; y: number },
  enemy: { x: number; y: number }
) {
  return (
    bullet.x < enemy.x + ENEMY_SIZE &&
    bullet.x + BULLET_WIDTH > enemy.x &&
    bullet.y < enemy.y + ENEMY_SIZE &&
    bullet.y + BULLET_HEIGHT > enemy.y
  );
}

// Sonido de beep simple y corto
function playSoundBeep() {
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  audio.volume = 0.3;
  audio.play().catch(() => null);
}

export default function Page() {
  // Marcamos si ya estamos en el cliente y no en el SSR
  const [isClient, setIsClient] = useState(false);
  // Referencia al canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estado global del juego
  const [gameState, setGameState] = useState<{
    playerX: number;
    bullets: Array<{ x: number; y: number }>;
    enemies: Array<{ x: number; y: number; dir: number }>;
    score: number;
  }>({
    playerX: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
    bullets: [],
    enemies: [],
    score: 0,
  });

  // Para detectar teclas presionadas
  const keys = useRef<Record<string, boolean>>({});

  /** Al montar el componente, marcamos que estamos en cliente */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /** Manejo de teclas para mover al jugador y disparar */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      if (e.key === " ") {
        // Crear bala
        setGameState((old) => ({
          ...old,
          bullets: [
            ...old.bullets,
            {
              x: old.playerX + PLAYER_SIZE / 2 - BULLET_WIDTH / 2,
              y: CANVAS_HEIGHT - 50,
            },
          ],
        }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /** Spawner de enemigos cada cierto tiempo, sólo en cliente */
  useEffect(() => {
    if (!isClient) return;
    const spawnInterval = setInterval(() => {
      setGameState((old) => {
        const newEnemies = [...old.enemies];
        newEnemies.push({
          x: Math.random() * (CANVAS_WIDTH - ENEMY_SIZE),
          y: 0,
          dir: Math.random() > 0.5 ? 1 : -1,
        });
        return { ...old, enemies: newEnemies };
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawnInterval);
  }, [isClient]);

  /** Loop principal ~60fps con setInterval(16ms) */
  useEffect(() => {
    if (!isClient) return;

    const loop = setInterval(() => {
      setGameState((old) => {
        let { playerX, bullets, enemies, score } = old;

        // Mover jugador
        if (keys.current["ArrowLeft"]) {
          playerX -= PLAYER_SPEED;
        }
        if (keys.current["ArrowRight"]) {
          playerX += PLAYER_SPEED;
        }
        // Limitar al canvas
        playerX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, playerX));

        // Mover balas hacia arriba y descartar las que salen
        bullets = bullets
          .map((b) => ({ ...b, y: b.y - BULLET_SPEED }))
          .filter((b) => b.y + BULLET_HEIGHT > 0);

        // Mover enemigos y descartar los que salen de la pantalla
        enemies = enemies.map((e) => {
          let newX = e.x + e.dir * ENEMY_MOVE_RANGE;
          let newY = e.y + ENEMY_SPEED;

          // Rebotes laterales
          if (newX < 0) {
            newX = 0;
            e.dir = 1;
          } else if (newX > CANVAS_WIDTH - ENEMY_SIZE) {
            newX = CANVAS_WIDTH - ENEMY_SIZE;
            e.dir = -1;
          }

          return { ...e, x: newX, y: newY };
        });
        enemies = enemies.filter((e) => e.y < CANVAS_HEIGHT);

        // Detectar colisiones entre balas y enemigos
        for (let bIndex = bullets.length - 1; bIndex >= 0; bIndex--) {
          for (let eIndex = enemies.length - 1; eIndex >= 0; eIndex--) {
            if (detectCollision(bullets[bIndex], enemies[eIndex])) {
              // Quitar bala y enemigo y sumar score
              bullets.splice(bIndex, 1);
              enemies.splice(eIndex, 1);
              score += 10;
              playSoundBeep();
              // Para evitar seguir comparando esta bala que ya no existe
              break;
            }
          }
        }

        return { playerX, bullets, enemies, score };
      });
    }, 16);

    return () => clearInterval(loop);
  }, [isClient]);

  /** Redibujo del canvas en cada cambio de estado */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { playerX, bullets, enemies } = gameState;

    // Jugador
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX, CANVAS_HEIGHT - 50, PLAYER_SIZE, PLAYER_SIZE);

    // Balas
    ctx.fillStyle = "red";
    bullets.forEach((b) => {
      ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    // Enemigos
    ctx.fillStyle = "green";
    enemies.forEach((e) => {
      ctx.fillRect(e.x, e.y, ENEMY_SIZE, ENEMY_SIZE);
    });
  }, [gameState]);

  // Hasta que no estemos en el cliente, no renderizamos nada (evita hydration error).
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">1942 - Score: {gameState.score}</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border bg-black border-gray-500"
      />
      <p>Flechas izquierda/derecha para mover, espacio para disparar.</p>
    </div>
  );
}
