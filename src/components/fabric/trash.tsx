/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

interface TrashProps {
  visible: boolean;
  fabricCanvas: any;
  onObjectDropped?: () => void;
  cursorPosition: { x: number; y: number };
}

export const Trash: React.FC<TrashProps> = ({
  visible,
  fabricCanvas,
  onObjectDropped,
  cursorPosition,
}) => {
  const [isOverTrashBin, setIsOverTrashBin] = useState<boolean>(false);
  const trashBinRef = useRef<HTMLDivElement>(null);
  const internalCursorRef = useRef<{ x: number; y: number }>(cursorPosition);
  const eventsSetupRef = useRef<boolean>(false);

  // Función para verificar si el cursor está sobre el tacho de basura
  const isCursorOverTrashBin = (): boolean => {
    if (!trashBinRef.current) return false;

    const trashBin = trashBinRef.current.getBoundingClientRect();
    const cursorX = internalCursorRef.current.x;
    const cursorY = internalCursorRef.current.y;

    return (
      cursorX >= trashBin.left &&
      cursorX <= trashBin.right &&
      cursorY >= trashBin.top &&
      cursorY <= trashBin.bottom
    );
  };

  // Actualizar la referencia interna cuando cambia la posición del cursor
  useEffect(() => {
    internalCursorRef.current = cursorPosition;
  }, [cursorPosition]);

  // Actualizar el estado visual según la posición
  useEffect(() => {
    if (visible && trashBinRef.current) {
      const isOver = isCursorOverTrashBin();
      setIsOverTrashBin(isOver);
    }
  }, [visible, cursorPosition]);

  // Configurar los event listeners una vez que el componente está montado
  // y el canvas está disponible
  useEffect(() => {
    if (!fabricCanvas || eventsSetupRef.current) return;

    // Manejador de movimiento
    const handleObjectMoving = (e: any) => {
      if (e.e) {
        // Determinar si es un evento táctil o de ratón
        const clientX = e.e.touches ? e.e.touches[0].clientX : e.e.clientX;
        const clientY = e.e.touches ? e.e.touches[0].clientY : e.e.clientY;

        // Actualizar posición interna
        internalCursorRef.current = { x: clientX, y: clientY };

        // Verificar si está sobre el trash
        if (trashBinRef.current) {
          const isOver = isCursorOverTrashBin();
          setIsOverTrashBin(isOver);
        }
      }
    };

    // Manejador de finalización de movimiento
    const handleObjectModified = (e: any) => {
      if (e.target) {
        // Verificar explícitamente al soltar
        const isOver = isCursorOverTrashBin();

        if (isOver) {
          // Si está sobre el trash, eliminamos
          setIsOverTrashBin(true);
          setTimeout(() => {
            fabricCanvas.remove(e.target);
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();

            if (onObjectDropped) {
              onObjectDropped();
            }

            setIsOverTrashBin(false);
          }, 200);
        } else {
          // Si no está sobre el trash, solo notificamos
          if (onObjectDropped) {
            onObjectDropped();
          }
        }
      }
    };

    // Establecer los event listeners
    fabricCanvas.on("object:moving", handleObjectMoving);

    // Asegurarse de que reemplazamos el listener existente
    fabricCanvas.off("object:modified");
    fabricCanvas.on("object:modified", handleObjectModified);

    // Marcar que los eventos ya están configurados
    eventsSetupRef.current = true;

    return () => {
      if (fabricCanvas) {
        fabricCanvas.off("object:moving", handleObjectMoving);
        fabricCanvas.off("object:modified", handleObjectModified);
      }
      eventsSetupRef.current = false;
    };
  }, [fabricCanvas, onObjectDropped]);

  // Usar useLayoutEffect para asegurarnos de que trashBinRef esté disponible lo antes posible
  useLayoutEffect(() => {
    if (visible && fabricCanvas && trashBinRef.current) {
      // Forzar re-evaluación de la posición después de renderizar
      const isOver = isCursorOverTrashBin();
      setIsOverTrashBin(isOver);
    }
  }, [visible, fabricCanvas]);

  if (!visible) return null;

  return (
    <div
      ref={trashBinRef}
      className={`border-1 border-white absolute cursor-pointer bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 flex items-center justify-center rounded-full ${
        isOverTrashBin
          ? "bg-[rgba(255,0,0,0.5)] scale-110"
          : "bg-[rgba(0,0,0,0.2)]"
      } transition-all duration-200 shadow-lg z-50`}
      data-testid="trash-bin"
    >
      <span
        className="text-4xl cursor-pointer"
        style={{
          fontSize: isOverTrashBin ? "2.75rem" : "2.25rem",
          transition: "all 0.2s ease",
          filter: isOverTrashBin
            ? "drop-shadow(0 0 3px rgba(255,255,255,0.8))"
            : "none",
        }}
      >
        🗑️
      </span>
    </div>
  );
};

export default Trash;