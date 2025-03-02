/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useRef, useEffect } from "react";
import { MenuButton } from "../commons/menuButton";
import { ImagePlus as ImageIcon } from "lucide-react";
import { sendTextToFront } from "../commons/sendTextToFront";

interface AddImageProps {
  fabricCanvasRef: React.RefObject<any>;
  isMobile: boolean;
}

const AddImage: React.FC<AddImageProps> = ({
  fabricCanvasRef,
  isMobile,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  // Referencia para controlar los dobles clics
  const lastClickTimeRef = useRef<number>(0);

  // Configurar el evento de clic una sola vez cuando el canvas esté disponible
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const handleMouseDown = () => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTimeRef.current;

      // Detectar si es un clic rápido (menos de 300ms desde el último clic)
      if (timeDiff < 300) {
        // Deseleccionar cualquier objeto seleccionado
        if (fabricCanvasRef.current.getActiveObject()) {
          fabricCanvasRef.current.discardActiveObject();
          fabricCanvasRef.current.requestRenderAll();
        }
      }

      lastClickTimeRef.current = currentTime;
    };

    // Registrar el evento
    fabricCanvasRef.current.on("mouse:down", handleMouseDown);
    
    // Limpiar el evento cuando el componente se desmonte
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off("mouse:down", handleMouseDown);
      }
    };
  }, [fabricCanvasRef.current]);

  const uploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          addImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      
      // Limpiar el valor del input para permitir seleccionar el mismo archivo nuevamente
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    },
    []
  );

  const addImage = useCallback(
    (imageSrc: string) => {
      if (!fabricCanvasRef.current) return;

      const fabric = (window as any).fabric;
      if (!fabric) return;

      const imgElement = new Image();
      imgElement.src = imageSrc;
      imgElement.onload = () => {
        const imgInstance = new fabric.Image(imgElement, {
          left: fabricCanvasRef.current.width / 2,
          top: fabricCanvasRef.current.height / 2,
          originX: "center",
          originY: "center",
          selectable: true,
          perPixelTargetFind: true,
          targetFindTolerance: 8,
        });

        imgInstance.setControlsVisibility({
          mt: false, // Controles medios desactivados
          mb: false,
          ml: false,
          mr: false,
          tl: true, // Controles de esquina activados
          tr: true,
          bl: true,
          br: true,
          mtr: !isMobile, // Rotación según dispositivo
        });

        const scaleX = fabricCanvasRef.current.width / imgInstance.width;
        const scaleY = fabricCanvasRef.current.height / imgInstance.height;
        const scale = Math.min(scaleX, scaleY) * 0.8;
        imgInstance.scale(scale);

        fabricCanvasRef.current.add(imgInstance);
        fabricCanvasRef.current.setActiveObject(imgInstance);
        fabricCanvasRef.current.renderAll();
        sendTextToFront(fabricCanvasRef.current);
      };
      imgElement.onerror = () => {
        console.error("Failed to load image");
      };
    },
    [fabricCanvasRef, isMobile]
  );

  // Manejar el clic en el botón para activar el input de archivos
  const handleButtonClick = () => {
    inputFileRef.current?.click();
  };

  return (
    <>
      {/* Input oculto para seleccionar archivos */}
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={uploadFile}
        style={{ display: "none" }}
      />
      {/* Botón visible que abre el selector de archivos */}
      <MenuButton
        onClick={handleButtonClick}
        text="Imagen"
        icon={<ImageIcon size={24} />}
      />
    </>
  );
};

export default AddImage;