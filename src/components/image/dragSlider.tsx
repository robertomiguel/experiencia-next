"use client";

import React, { useState, useRef, useEffect } from "react";

interface DragSliderProps {
  initialPosition?: number;
  redContent?: any;
  yellowContent?: any;
  width?: string;
  height?: string;
}

const DragSlider: React.FC<DragSliderProps> = ({
  initialPosition = 50,
  redContent = "DIV ROJO",
  yellowContent = "DIV AMARILLO",
  width = "w-80",
  height = "h-60",
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(initialPosition);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Función para calcular la posición del slider basada en la posición del mouse/dedo
  const updateSliderPosition = (clientX: number): void => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const relativeX = clientX - containerRect.left;

    // Calcular porcentaje (limitado entre 0-100)
    const percentage = Math.max(
      0,
      Math.min(100, (relativeX / containerWidth) * 100)
    );
    setSliderPosition(percentage);
  };

  // Manejadores de eventos para mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    isDraggingRef.current = true;
    updateSliderPosition(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (!isDraggingRef.current) return;
    updateSliderPosition(e.clientX);
  };

  const handleMouseUp = (): void => {
    isDraggingRef.current = false;
  };

  // Manejadores de eventos para táctil
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    isDraggingRef.current = true;
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent): void => {
    if (!isDraggingRef.current) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchEnd = (): void => {
    isDraggingRef.current = false;
  };

  // Configurar y limpiar event listeners
  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    const mouseUpHandler = () => handleMouseUp();
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = () => handleTouchEnd();

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("touchmove", touchMoveHandler, {
      passive: false,
    });
    document.addEventListener("touchend", touchEndHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("touchmove", touchMoveHandler);
      document.removeEventListener("touchend", touchEndHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 select-none rounded-lg ">
      <div
        ref={containerRef}
        className={`relative w-[512px] h-[768px] overflow-hidden border-2 m-4 border-blue-800 select-none rounded-lg`}
      >
        {/* Div rojo (fondo) */}
        <div className="absolute">{redContent}</div>

        {/* Div amarillo (capa superior) con clip-path dinámico */}
        <div
          className="absolute"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          {yellowContent}
        </div>

        {/* Línea vertical y control del slider */}
        <div
          className="absolute top-0 h-full w-6 z-10 cursor-col-resize touch-manipulation flex items-center justify-center"
          style={{ left: `calc(${sliderPosition}% - 12px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Línea del slider */}
          <div className="h-full w-[1px] bg-black"></div>
          <div className="h-full w-[1px] bg-white"></div>

          {/* Controlador del slider */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-[20px] h-[20xpx] bg-black rounded-full flex items-center justify-center">
            <div className="w-[16px] h-[16px] rounded-full bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragSlider;