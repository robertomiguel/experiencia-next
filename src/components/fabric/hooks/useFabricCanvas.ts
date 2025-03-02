// useFabricCanvas.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useFabricScript } from "./useFabricScript";

export const useFabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const isFabricLoaded = useFabricScript();

  // En useFabricCanvas.ts, después de crear el canvas:
  useEffect(() => {
    if (!isFabricLoaded || !canvasRef.current || fabricCanvasRef.current)
      return;

    const fabric = (window as any).fabric;
    if (fabric) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#f3f3f3",
        selection: false,
        preserveObjectStacking: true,
        centeredScaling: false,
        centeredRotation: false,
        perPixelTargetFind: false,
        targetFindTolerance: 8,
        uniScaleTransform: true,
        stopContextMenu: true,
      });

      // IMPORTANTE: Establecer estos estilos para todos los objetos
      // INCLUIDOS los textbox
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

      // Para textbox específicamente
      if (fabric.Textbox && fabric.Textbox.prototype) {
        fabric.Textbox.prototype.set({
          editingBorderColor: "#2196F3", // Mismo color que borderColor
        });
      }

      // Asegúrate de hacer el render inicial
      fabricCanvasRef.current.renderAll();
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [isFabricLoaded]);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current
      .getObjects()
      .forEach((obj: any) => fabricCanvasRef.current.remove(obj));
    fabricCanvasRef.current.renderAll();
  }, []);

  const switchBackGroundColor = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.set(
      "backgroundColor",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
    fabricCanvasRef.current.renderAll();
  }, []);

  return {
    canvasRef,
    fabricCanvasRef,
    isFabricLoaded,
    clearCanvas,
    switchBackGroundColor,
  };
};