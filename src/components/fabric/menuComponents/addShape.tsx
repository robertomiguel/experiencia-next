/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { sendTextToFront } from "../commons/sendTextToFront";
import { MenuButton } from "../commons/menuButton";
import { Shapes } from "lucide-react";

interface AddShapeProps {
  fabricCanvasRef: React.RefObject<any>;
  isMobile: boolean;
}

const AddShape: React.FC<AddShapeProps> = ({
  fabricCanvasRef,
  isMobile,
}) => {
  const addRectangle = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const fabric = (window as any).fabric;
    if (!fabric) return;

    const rect = new fabric.Rect({
      left: 200,
      top: 200,
      fill: "blue",
      width: 100,
      height: 100,
      selectable: true,
      originX: "center",
      originY: "center",
    });

    rect.setControlsVisibility({
      mtr: !isMobile, // Rotación según dispositivo
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
    sendTextToFront(fabricCanvasRef.current);
  }, [fabricCanvasRef, isMobile, sendTextToFront]);

  // Aquí podrían agregarse más métodos para otros tipos de formas
  // Por ejemplo: addCircle, addTriangle, addPolygon, etc.

  return (
    <MenuButton onClick={addRectangle} text="Figura" icon={<Shapes />} />    
  );
};

export default AddShape;
