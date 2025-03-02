/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFabricScript } from "./hooks/useFabricScript";

export const Fabric = ({ isMobile }: { isMobile: boolean }) => {
  const [objSelected, setObjSelected] = useState<any>(null);
  const [showTrashBin, setShowTrashBin] = useState(false);
  const [isOverTrashBin, setIsOverTrashBin] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const trashBinRef = useRef<HTMLDivElement>(null);
  const isMovingRef = useRef(false);

  const isFabricLoaded = useFabricScript();

  const cursorPositionRef = useRef({ x: 0, y: 0 });

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
    if (!isFabricLoaded || !canvasRef.current || fabricCanvasRef.current)
      return;

    const fabric = (window as any).fabric;
    if (fabric) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#f3f3f3",
        selection: false,
        preserveObjectStacking: true,
        centeredScaling: false,
        centeredRotation: false,
        perPixelTargetFind: false,
      });

      fabricCanvasRef.current.on("selection:created", (e: any) => {
        const newSelected = e.selected[0] || null;
        if (newSelected !== objSelected) setObjSelected(newSelected || null);
      });

      fabricCanvasRef.current.on("selection:updated", (e: any) => {
        const newSelected = e.selected[0] || null;
        if (newSelected !== objSelected) setObjSelected(e.selected[0] || null);
      });

      fabricCanvasRef.current.on("selection:cleared", () => {
        setObjSelected(null);
      });

      fabricCanvasRef.current.on("object:moving", (e: any) => {
        if (!isMovingRef.current) {
          setShowTrashBin(true);
          isMovingRef.current = true;
        }

        // Almacenar la posición actual del cursor/dedo
        if (e.e) {
          // Determinar si es un evento táctil o de ratón
          const clientX = e.e.touches ? e.e.touches[0].clientX : e.e.clientX;
          const clientY = e.e.touches ? e.e.touches[0].clientY : e.e.clientY;

          // Guardar la posición actual
          cursorPositionRef.current = { x: clientX, y: clientY };

          // Verificar si el cursor está sobre el tacho
          const isOver = isCursorOverTrashBin();
          setIsOverTrashBin(isOver);
        }
      });

      fabricCanvasRef.current.on("object:modified", (e: any) => {
        if (isMovingRef.current) {
          // Check if cursor is over trash bin when object is dropped
          if (e.target && isCursorOverTrashBin()) {
            // Animar el tacho brevemente antes de eliminar
            setIsOverTrashBin(true);
            setTimeout(() => {
              fabricCanvasRef.current.remove(e.target);
              fabricCanvasRef.current.discardActiveObject();
              fabricCanvasRef.current.requestRenderAll();
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
      });
    }

    fabric.Object.prototype.set({
      // Configuración para bordes
      borderColor: "#2196F3", // Azul visible
      borderDashArray: [5, 5], // Borde punteado para mejor visibilidad
      borderScaleFactor: 1.5, // Borde más ancho

      // Configuración para esquinas
      cornerColor: "#FFFFFF", // Esquinas blancas
      cornerStrokeColor: "#1565C0", // Borde azul oscuro para contraste
      cornerSize: 10, // Tamaño adecuado
      cornerStyle: "circle", // Forma circular
      cornerStrokeWidth: 1.5, // Borde de las esquinas
      transparentCorners: false, // Esquinas sólidas

      // Otras configuraciones
      padding: 2, // Espacio para facilitar selección
      rotatingPointOffset: 25, // Mejor separación del control de rotación
    });

    fabricCanvasRef.current?.renderAll();

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFabricLoaded]);

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
    sendTextToFront();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    });
    text.setControlsVisibility({
      mtr: !isMobile, // Rotación según dispositivo
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  }, []);

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const sendTextToFront = useCallback(() => {
    fabricCanvasRef.current.getObjects().forEach((obj: any) => {
      if (obj.type === "textbox") {
        fabricCanvasRef.current.bringToFront(obj);
      }
    });
    fabricCanvasRef.current.renderAll();
  }, []);

  const addImage = useCallback((imageSrc: string) => {
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

        // Detectar si es un clic rápido (menos de 300ms desde el último clic)
        if (timeDiff < 300) {
          isDoubleClick = true;

          // Deseleccionar cualquier objeto seleccionado
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
      sendTextToFront();
    };
    imgElement.onerror = () => {
      console.error("Failed to load image");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current
      .getObjects()
      .forEach((obj: any) => fabricCanvasRef.current.remove(obj));
    fabricCanvasRef.current.renderAll();
  }, []);

  const switchBackGroundColor = useCallback(() => {
    fabricCanvasRef.current?.set(
      "backgroundColor",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
    fabricCanvasRef.current?.renderAll();
  }, []);

  /*
    var dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8
    });
  */

  return (
    <div className="flex flex-col items-center p-4">
      {!isFabricLoaded ? (
        <p>Iniciando...</p>
      ) : (
        <>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={uploadFile}
            style={{ display: "none" }}
          />
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={isMobile ? window.innerWidth : 600}
              height={400}
              className="border border-gray-400"
            />
            {showTrashBin && (
              <div
                ref={trashBinRef}
                className={`border-1 border-white absolute cursor-pointer bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 flex items-center justify-center rounded-full ${
                  isOverTrashBin
                    ? "bg-[rgba(255,0,0,0.5)] scale-110"
                    : "bg-[rgba(0,0,0,0.2)]"
                } transition-all duration-200 shadow-lg z-50`}
                data-testid="trash-bin"
              >
                <span
                  className="text-4xl cursor-pointer"
                  style={{
                    fontSize: isOverTrashBin ? "2.75rem" : "2.25rem",
                    transition: "all 0.2s ease",
                    filter: isOverTrashBin
                      ? "drop-shadow(0 0 3px rgba(255,255,255,0.8))"
                      : "none",
                  }}
                >
                  🗑️
                </span>
              </div>
            )}
          </div>
          <div>
            {objSelected && (
              <div className="mt-4 space-x-2">
                Seleccionado: {objSelected.type}
              </div>
            )}
          </div>
          <div className="mt-4 w-full flex flex-wrap justify-center items-center flex-row gap-4">
            <button
              className="bg-transparent w-fit h-fit rounded-full"
              onClick={addRectangle}
            >
              Cuadrado 🟦
            </button>
            <button
              className="bg-transparent w-fit h-fit rounded-full"
              onClick={addText}
            >
              Texto ✏
            </button>
            <button
              className="bg-transparent w-fit h-fit rounded-full"
              onClick={() => inputFileRef.current?.click()}
            >
              Imagen 🖼
            </button>
            <button
              className="bg-transparent w-fit h-fit rounded-full"
              onClick={switchBackGroundColor}
            >
              Fondo 🌈
            </button>
            <button
              className="bg-transparent w-fit h-fit rounded-full"
              onClick={clearCanvas}
            >
              Limpiar 🧹
            </button>
          </div>
        </>
      )}
    </div>
  );
};
