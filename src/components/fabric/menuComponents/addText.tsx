import React, { useCallback } from "react";
import { MenuButton } from "../commons/menuButton";
import { Type } from "lucide-react";

interface AddTextProps {
  fabricCanvasRef: React.RefObject<any>; // Cambiado para recibir la referencia completa
  isMobile: boolean;
}

const AddText: React.FC<AddTextProps> = ({
  fabricCanvasRef,
  isMobile,
}) => {
  const addText = useCallback(() => {
    // Verificar que el canvas esté disponible a través de la referencia
    if (!fabricCanvasRef.current) return;

    const fabric = (window as any).fabric;
    if (!fabric) return;

    const text = new fabric.Textbox("Hello, Fabric.js!", {
      left: 200,
      top: 200,
      fontSize: 24,
      fill: "black",
      selectable: true,
      originX: "center",
      originY: "center",
    });

    text.setControlsVisibility({
      mtr: !isMobile, // Rotación según dispositivo
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();

    // Llamar a sendTextToFront para asegurar que el texto siempre esté en primer plano
    // sendTextToFront(fabricCanvasRef.current);
  }, [fabricCanvasRef, isMobile]);

  return (
    <MenuButton onClick={addText} text="Texto" icon={<Type />} />
  );
};

export default AddText;
