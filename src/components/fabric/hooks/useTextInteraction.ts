// useTextInteraction.ts
import { useEffect, RefObject } from "react";

export const useTextInteraction = (fabricCanvasRef: RefObject<any>) => {
  useEffect(() => {
    // Almacenar la referencia actual en una variable dentro del efecto
    const currentCanvas = fabricCanvasRef.current;
    if (!currentCanvas) return;

    const handleDblClick = (options: any) => {
      if (options.target && options.target.type === "textbox") {
        // Entrar en modo edición con doble clic
        options.target.enterEditing();
        options.target.selectAll();
        currentCanvas.renderAll();
      }
    };

    // Mejorar la interacción con textos existentes
    const handleTextCreated = (objects: any) => {
      objects.forEach((obj: any) => {
        if (obj.type === "textbox") {
          // Desactiva el pixel-perfect para textos
          obj.perPixelTargetFind = false;

          // Mejorar la apariencia en edición
          obj.borderColor = "rgba(0,0,255,0.5)";
          obj.editingBorderColor = "rgba(0,0,255,0.8)";
          obj.cornerColor = "rgba(0,0,255,0.5)";
          obj.transparentCorners = false;
          obj.padding = 10;

          // Asegurar que tenga controles visibles
          obj.setControlsVisibility({
            mtr: true,
            tl: true,
            tr: true,
            bl: true,
            br: true,
          });
        }
      });
    };

    // Registrar eventos
    currentCanvas.on("mouse:dblclick", handleDblClick);

    // Para textos que ya existan o se agreguen en el futuro
    const existingObjects = currentCanvas.getObjects();
    handleTextCreated(existingObjects);

    currentCanvas.on("object:added", (e: any) => {
      if (e.target && e.target.type === "textbox") {
        handleTextCreated([e.target]);
      }
    });

    return () => {
      if (currentCanvas) {
        currentCanvas.off("mouse:dblclick", handleDblClick);
        currentCanvas.off("object:added");
      }
    };
  }, [fabricCanvasRef]);
};
