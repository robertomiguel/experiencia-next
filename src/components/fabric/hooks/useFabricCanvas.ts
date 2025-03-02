// useFabricCanvas.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useFabricScript } from "./useFabricScript";

export const useFabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const isFabricLoaded = useFabricScript();

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

      // Establecer estilos de control globales
      fabric.Object.prototype.set({
        transparentCorners: false,
        borderColor: "rgba(0,0,255,0.5)",
        cornerColor: "rgba(0,0,255,0.5)",
        cornerSize: 10,
        padding: 5,
        cornerStyle: "circle",
      });

      // render inicial
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