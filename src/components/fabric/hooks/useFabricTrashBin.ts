// useFabricTrashBin.ts
import { useCallback, useEffect, useRef, useState, RefObject } from "react";

export const useFabricTrashBin = (fabricCanvasRef: RefObject<any>) => {
  const [showTrashBin, setShowTrashBin] = useState(false);
  const [isOverTrashBin, setIsOverTrashBin] = useState(false);
  const trashBinRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);

  const isCursorOverTrashBin = useCallback(() => {
    if (!trashBinRef.current) return false;

    const trashBin = trashBinRef.current.getBoundingClientRect();
    const cursorX = cursorPositionRef.current.x;
    const cursorY = cursorPositionRef.current.y;

    return (
      cursorX >= trashBin.left &&
      cursorX <= trashBin.right &&
      cursorY >= trashBin.top &&
      cursorY <= trashBin.bottom
    );
  }, []);

  useEffect(() => {
    const currentCanvas = fabricCanvasRef.current;
    if (!currentCanvas) return;

    const handleObjectMoving = (e: any) => {
      if (!isMovingRef.current) {
        setShowTrashBin(true);
        isMovingRef.current = true;
      }

      if (e.e) {
        const clientX = e.e.touches ? e.e.touches[0].clientX : e.e.clientX;
        const clientY = e.e.touches ? e.e.touches[0].clientY : e.e.clientY;

        cursorPositionRef.current = { x: clientX, y: clientY };
        setIsOverTrashBin(isCursorOverTrashBin());
      }
    };

    const handleObjectModified = (e: any) => {
      if (isMovingRef.current) {
        if (e.target && isCursorOverTrashBin()) {
          setIsOverTrashBin(true);
          setTimeout(() => {
            currentCanvas.remove(e.target);
            currentCanvas.discardActiveObject();
            currentCanvas.requestRenderAll();
            setShowTrashBin(false);
            setIsOverTrashBin(false);
            isMovingRef.current = false;
          }, 200);
        } else {
          setShowTrashBin(false);
          setIsOverTrashBin(false);
          isMovingRef.current = false;
        }
      }
    };

    currentCanvas.on("object:moving", handleObjectMoving);
    currentCanvas.on("object:modified", handleObjectModified);

    return () => {
      if (currentCanvas) {
        currentCanvas.off("object:moving", handleObjectMoving);
        currentCanvas.off("object:modified", handleObjectModified);
      }
    };
  }, [fabricCanvasRef, isCursorOverTrashBin]);

  return {
    showTrashBin,
    isOverTrashBin,
    trashBinRef,
  };
};
