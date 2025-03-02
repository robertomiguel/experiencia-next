/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useFabricScript } from "./hooks/useFabricScript";
import Trash from "./trash";
import { CanvasMenu } from "./canvasMenu";
import { sendTextToFront } from "./commons/sendTextToFront";

export const DEFAULT_BACKGROUND_COLOR = "#f3f3f3";
const DEFAULT_CANVAS_WIDTH = 600;
const DEFAULT_CANVAS_HEIGHT = 400;

export const Fabric = ({ isMobile }: { isMobile: boolean }) => {
  const [objSelected, setObjSelected] = useState<any>(null); // Objeto seleccionado
  const [showTrashBin, setShowTrashBin] = useState(false); // Mostrar/ocultar el tacho

  const canvasRef = useRef<HTMLCanvasElement>(null); // canvas para dibujar en pantalla
  const fabricCanvasRef = useRef<any>(null); // canvas del script
  const isMovingRef = useRef(false); // requerido para mostrar/ocultar el tacho

  const isFabricLoaded = useFabricScript(); // informa cuando se terminó de cargar el script de fabric

  const cursorPositionRef = useRef({ x: 0, y: 0 }); // requerido para eliminar objetos sobre el tacho

  useEffect(() => {
    if (!isFabricLoaded || !canvasRef.current || fabricCanvasRef.current)
      return;

    const fabric = (window as any).fabric;
    if (fabric) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
        selection: false,
        preserveObjectStacking: true,
        centeredScaling: false,
        centeredRotation: false,
        perPixelTargetFind: false,
      });

      fabricCanvasRef.current.on("selection:created", (e: any) => {
        const newSelected = e.selected[0] || null;
        if (newSelected !== objSelected) setObjSelected(newSelected || null);
      });

      fabricCanvasRef.current.on("selection:updated", (e: any) => {
        const newSelected = e.selected[0] || null;
        if (newSelected !== objSelected) setObjSelected(e.selected[0] || null);
      });

      fabricCanvasRef.current.on("selection:cleared", () => {
        setObjSelected(null);
      });

      fabricCanvasRef.current.on("object:moving", (e: any) => {
        if (!isMovingRef.current) {
          setShowTrashBin(true);
          isMovingRef.current = true;
        }

        // Almacenar la posición actual del cursor/dedo
        if (e.e) {
          // Determinar si es un evento táctil o de ratón
          const clientX = e.e.touches ? e.e.touches[0].clientX : e.e.clientX;
          const clientY = e.e.touches ? e.e.touches[0].clientY : e.e.clientY;

          // Guardar la posición actual
          cursorPositionRef.current = { x: clientX, y: clientY };
        }
      });
    }

    fabric.Object.prototype.set({
      // Configuración para bordes
      borderColor: "#2196F3", // Azul visible
      borderDashArray: [5, 5], // Borde punteado para mejor visibilidad
      borderScaleFactor: 1.5, // Borde más ancho

      // Configuración para esquinas
      cornerColor: "#FFFFFF", // Esquinas blancas
      cornerStrokeColor: "#1565C0", // Borde azul oscuro para contraste
      cornerSize: 10, // Tamaño adecuado
      cornerStyle: "circle", // Forma circular
      cornerStrokeWidth: 1.5, // Borde de las esquinas
      transparentCorners: false, // Esquinas sólidas

      // Otras configuraciones
      padding: 2, // Espacio para facilitar selección
      rotatingPointOffset: 25, // Mejor separación del control de rotación
    });

    fabricCanvasRef.current?.renderAll();

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [isFabricLoaded]);

  useEffect(() => {
    if (!objSelected) return;
    switch (objSelected?.type) {
      case "rect":
      case "image":
        objSelected.bringToFront
          ? objSelected.bringToFront()
          : fabricCanvasRef.current.bringToFront(objSelected);
        sendTextToFront(fabricCanvasRef.current);
        break;
      default:
        break;
    }
  }, [objSelected]);

  return (
    <div className="flex flex-col items-center">
      {!isFabricLoaded ? (
        <p>Iniciando...</p>
      ) : (
        <div className="relative flex flex-col items-center gap-4">
          <CanvasMenu fabricCanvasRef={fabricCanvasRef} isMobile={isMobile} />
          <canvas
            ref={canvasRef}
            width={isMobile ? window.innerWidth : DEFAULT_CANVAS_WIDTH}
            height={DEFAULT_CANVAS_HEIGHT}
            className="border border-gray-400"
          />
          <Trash
            visible={showTrashBin}
            cursorPosition={cursorPositionRef.current}
            fabricCanvas={fabricCanvasRef.current}
            onObjectDropped={() => {
              setShowTrashBin(false);
              isMovingRef.current = false;
            }}
          />
        </div>
      )}
    </div>
  );
};
