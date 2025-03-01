'use client'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFabricScript } from "./useFabricScript";

/* const isMobile = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
}; */

const Fabric: React.FC = () => {
  const [objSelected, setObjSelected] = useState<any>(null);
  const [isMoving, setIsMoving] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const isMovingRef = useRef(false);

  const isFabricLoaded = useFabricScript();

  useEffect(() => {
    if (!isFabricLoaded || !canvasRef.current || fabricCanvasRef.current)
      return;

    const fabric = (window as any).fabric;
    if (fabric) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#f3f3f3",
        selection: false,
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current.on("selection:created", (e: any) => {        
        const newSelected = e.selected[0] || null;
        if (newSelected !== objSelected)
            setObjSelected(newSelected || null);
      });

      fabricCanvasRef.current.on("selection:updated", (e: any) => {        
        const newSelected = e.selected[0] || null;
        if (newSelected !== objSelected) setObjSelected(e.selected[0] || null);
      });

      fabricCanvasRef.current.on("selection:cleared", () => {
          setObjSelected(null);
      });

      fabricCanvasRef.current.on("object:moving", () => {
        if (!isMovingRef.current) {
          setIsMoving(true);
          isMovingRef.current = true;
        }
      });

      fabricCanvasRef.current.on("object:modified", () => {
        if (isMovingRef.current) {
          if (isMovingRef.current) setIsMoving(false);
          isMovingRef.current = false;
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFabricLoaded]);

  const addRectangle = useCallback( () => {
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
    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
    sendTextToFront();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addText = useCallback( () => {
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
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  }, []);

  const uploadFile = useCallback( (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        addImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendTextToFront = useCallback( () => {
    fabricCanvasRef.current.getObjects().forEach((obj: any) => {
      if (obj.type === "textbox") {
        fabricCanvasRef.current.bringToFront(obj);
      }
    });
    fabricCanvasRef.current.renderAll();
  }, []);

  const addImage = useCallback( (imageSrc: string) => {
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

  const clearCanvas = useCallback( () => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current
      .getObjects()
      .forEach((obj: any) => fabricCanvasRef.current.remove(obj));
    fabricCanvasRef.current.renderAll();
  }, []);

  /* const switchBackGroundColor = () => {
    fabricCanvasRef.current?.set(
      "backgroundColor",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
    fabricCanvasRef.current?.renderAll();
  }; */

  return (
    <div className="flex flex-col items-center p-4">
      {!isFabricLoaded ? (
        <p>Loading Fabric.js with Gestures...</p>
      ) : (
        <>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={uploadFile}
            className="hidden"
          />
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border border-gray-400"
          />
          <div>
            {objSelected && (
              <div className="mt-4 space-x-2">
                Seleccionado : {objSelected.type}
              </div>
            )}
          </div>
          <div className="mt-4 w-full flex justify-center items-center md:flex-row flex-col gap-4">
            <button
              className="bg-transparent w-fit h-fit rounded-full"
              onClick={addRectangle}
            >
              Recuadro 🟦
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

export default Fabric;
