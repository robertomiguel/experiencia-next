import { useCallback } from "react";

const useCanvasTrim = () => {
  // Umbral de opacidad mínima para considerar un píxel "visible"
  const OPACITY_THRESHOLD = 10;

  // Función para encontrar los límites del contenido visible, ignorando baja opacidad
  const getTrimmedBounds = (imageData: ImageData) => {
    const { data, width, height } = imageData;
    let top = height,
      bottom = 0,
      left = width,
      right = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        if (data[index + 3] > OPACITY_THRESHOLD) {
          // Ignorar píxeles con baja opacidad
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }
    return { top, bottom, left, right };
  };

  // Función para recortar los espacios en blanco del canvas
  const trimCanvas = useCallback(
    (
      canvas: HTMLCanvasElement | null,
      debug: boolean = false
    ): HTMLCanvasElement | null => {
      if (!canvas) return null;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { top, bottom, left, right } = getTrimmedBounds(imgData);

      if (top >= bottom || left >= right) {
        console.warn("No hay contenido visible para recortar.");
        return null;
      }

      // Dibuja un rectángulo rojo en los límites detectados para depuración
      if (debug) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, right - left, bottom - top);
      }

      // Crear un nuevo canvas con el área recortada
      const trimmedWidth = right - left + 1;
      const trimmedHeight = bottom - top + 1;
      const trimmedCanvas = document.createElement("canvas");
      trimmedCanvas.width = trimmedWidth;
      trimmedCanvas.height = trimmedHeight;

      const trimmedCtx = trimmedCanvas.getContext("2d");
      if (!trimmedCtx) return null;

      trimmedCtx.putImageData(
        ctx.getImageData(left, top, trimmedWidth, trimmedHeight),
        0,
        0
      );

      return trimmedCanvas;
    },
    []
  );

  // Función para descargar la imagen recortada con nombre opcional
  const downloadTrimmedImage = useCallback(
    (
      canvas: HTMLCanvasElement | null,
      filename: string = "imagen_editada.webp",
      debug: boolean = false
    ) => {
      const trimmedCanvas = trimCanvas(canvas, debug);
      if (!trimmedCanvas) return;

      const link = document.createElement("a");
      link.download = filename;
      link.href = trimmedCanvas.toDataURL("image/webp");
      link.click();
    },
    [trimCanvas]
  );

  return { trimCanvas, downloadTrimmedImage };
};

export default useCanvasTrim;
