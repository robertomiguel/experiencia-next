import React, { useCallback } from "react";
import { DEFAULT_BACKGROUND_COLOR } from "../fabric";
import { MenuButton } from "../commons/menuButton";
import { Trash2 } from "lucide-react";

interface ResetCanvasProps {
  fabricCanvasRef: React.RefObject<any>;
}

const ResetCanvas: React.FC<ResetCanvasProps> = ({ fabricCanvasRef }) => {
  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    // Elimina todos los objetos del canvas
    fabricCanvasRef.current
      .getObjects()
      .forEach((obj: any) => fabricCanvasRef.current.remove(obj));

    // Restaura el color de fondo original
    fabricCanvasRef.current.set("backgroundColor", DEFAULT_BACKGROUND_COLOR);

    // Renderiza el canvas actualizado
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);

  return (
    <MenuButton onClick={clearCanvas} text="Limpiar" icon={<Trash2 />} />
  );
};

export default ResetCanvas;
