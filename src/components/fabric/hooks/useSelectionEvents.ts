// useSelectionEvents.ts
import { useEffect, useState, RefObject } from "react";

export const useSelectionEvents = (fabricCanvasRef: RefObject<any>) => {
  const [selectedObject, setSelectedObject] = useState<any>(null);

  useEffect(() => {
    const currentCanvas = fabricCanvasRef.current;
    if (!currentCanvas) return;

    const handleSelectionCreated = (e: any) => {
      const newSelected = e.selected?.[0] || null;
      setSelectedObject(newSelected);
    };

    const handleSelectionUpdated = (e: any) => {
      const newSelected = e.selected?.[0] || null;
      setSelectedObject(newSelected);
    };

    const handleSelectionCleared = () => {
      setSelectedObject(null);
    };

    currentCanvas.off("selection:created");
    currentCanvas.off("selection:updated");
    currentCanvas.off("selection:cleared");

    currentCanvas.on("selection:created", handleSelectionCreated);
    currentCanvas.on("selection:updated", handleSelectionUpdated);
    currentCanvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      if (currentCanvas) {
        currentCanvas.off("selection:created", handleSelectionCreated);
        currentCanvas.off("selection:updated", handleSelectionUpdated);
        currentCanvas.off("selection:cleared", handleSelectionCleared);
      }
    };
  }, [fabricCanvasRef]);

  return { selectedObject };
};
