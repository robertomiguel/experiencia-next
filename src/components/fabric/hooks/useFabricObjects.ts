// useFabricObjects.ts
import { useCallback } from "react";
import { sendTextToFront } from "../fabricHelpers";
import { isMobile } from "../deviceDetection";

export const useFabricObjects = (
  fabricCanvasRef: React.MutableRefObject<any>
) => {
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
      mtr: !isMobile,
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
    sendTextToFront(fabricCanvasRef.current);
  }, [fabricCanvasRef]);

  const addText = useCallback(() => {
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
      transparentCorners: false,
      cornerColor: "rgba(0,0,255,0.5)",
      cornerSize: 10,
      padding: 10,
      borderColor: "rgba(0,0,255,0.5)",
      editingBorderColor: "rgba(0,0,255,0.8)",
      lockUniScaling: false,
      // Mejora la detección de clic para textos
      perPixelTargetFind: false,
      // Hacer que la caja del texto sea más grande para facilitar la selección
      strokeWidth: 0,
      hasControls: true,
    });

    text.setControlsVisibility({
      mtr: !isMobile,
      tl: true,
      tr: true,
      bl: true,
      br: true,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);

    text.enterEditing();

    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);

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

        let isDoubleClick = false;
        let lastClickTime = 0;

        fabricCanvasRef.current.on("mouse:down", function () {
          const currentTime = new Date().getTime();
          const timeDiff = currentTime - lastClickTime;

          if (timeDiff < 300) {
            isDoubleClick = true;

            if (fabricCanvasRef.current.getActiveObject()) {
              fabricCanvasRef.current.discardActiveObject();
              fabricCanvasRef.current.requestRenderAll();
            }
          } else {
            isDoubleClick = false;
          }

          lastClickTime = currentTime;
        });

        imgInstance.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
          tl: true,
          tr: true,
          bl: true,
          br: true,
          mtr: !isMobile,
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
    [fabricCanvasRef]
  );

  return {
    addRectangle,
    addText,
    addImage,
  };
};