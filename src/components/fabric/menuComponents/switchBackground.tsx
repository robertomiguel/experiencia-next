import React, { useCallback } from "react";
import { MenuButton } from "../commons/menuButton";
import { Image as ImageIcon } from "lucide-react";

interface SwitchBackgroundProps {
  fabricCanvasRef: React.RefObject<any>;
}

const SwitchBackground: React.FC<SwitchBackgroundProps> = ({
  fabricCanvasRef,
}) => {
  const switchBackGroundColor = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    // Genera un color aleatorio hexadecimal
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    // Establece el color de fondo del canvas
    fabricCanvasRef.current.set("backgroundColor", randomColor);
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);

  return (
    <MenuButton onClick={switchBackGroundColor} text="Fondo" icon={<ImageIcon />} />
  );
};

export default SwitchBackground;
