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

    // Configuración mínima para textboxes - SIN ESTILOS
    const configureTextbox = (textbox: any) => {
      if (!textbox || textbox.type !== "textbox") return;

      // Sólo configuramos la detección de clics y visibilidad de controles
      // NO aplicamos ningún estilo de color o apariencia
      textbox.perPixelTargetFind = false;

      textbox.setControlsVisibility({
        mtr: true,
        tl: true,
        tr: true,
        bl: true,
        br: true,
      });
    };

    // Registrar eventos
    currentCanvas.on("mouse:dblclick", handleDblClick);

    // Para textos existentes
    currentCanvas.getObjects().forEach((obj: any) => {
      if (obj.type === "textbox") configureTextbox(obj);
    });

    // Para textos nuevos
    currentCanvas.on("object:added", (e: any) => {
      if (e.target && e.target.type === "textbox") {
        configureTextbox(e.target);
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
