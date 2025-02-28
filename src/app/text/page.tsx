"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, FabricText, FabricImage } from "fabric";
import useCanvasTrim from "@/components/common/useCanvasTrim";

export default function Page() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [text, setText] = useState("nuevo texto");
  const [objSelected, setObjSelected] = useState<any[]>([]);

  // Inicio del canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // creamos el canvas para dibujar
    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: 600,
      backgroundColor: "black",
      preserveObjectStacking: true, // mantiene el orden de los objetos, requerido para mantener los textos sobre las imágenes
    });
    // eventos para seleccionar el objeto/s seleccionado/s
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => {
      setObjSelected([]);
    });

    // mantiene los textos sobre las imágenes
    function handleSelection(e: any) {
      if (e.selected && e.selected.length > 0) {
        e.selected.forEach((obj: any) => {
          if (obj.type === "text") {
            canvas.bringObjectToFront(obj);
          }

          if (obj.type === "image") {
            // enviar al fondo todas las imágens menos la imagen actual
            canvas.getObjects().forEach((o) => {
              if (o.type === "image" && o !== obj) {
                canvas.sendObjectToBack(o);
              }
            });

            // canvas.sendObjectToBack(obj);
          }
        });

        setObjSelected(e.selected);
      }
    }

    canvas.renderAll();

    // guarda el canvas para trabajarlo desde otros métodos
    fabricCanvasRef.current = canvas;

    // limpiar el canvas al desmontar el componente
    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleSelection);

      canvas.dispose();
    };
  }, []);

  // Carga textos en el canvas
  const addText = (text: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || text.length === 0) return;
    // nuevo texto
    const newText = new FabricText(text, {
      left: 10,
      top: 10,
      fill: "white",
      selectable: true,
    });
    canvas.add(newText);
    canvas.renderAll();
  };

  const { trimCanvas } = useCanvasTrim();

  // carga de imágenes desdel input file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const newCanvas = document.createElement("canvas");
      const ctx = newCanvas.getContext("2d");
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        newCanvas.width = img.width;
        newCanvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const trimed = trimCanvas(newCanvas);
        img.src = trimed?.toDataURL() as string;
        img.onload = () => {
          const fabricImage = new FabricImage(img, {
            left: 10,
            top: 10,
          });

          fabricCanvasRef.current?.add(fabricImage);
          fabricCanvasRef.current?.sendObjectToBack(fabricImage);
          fabricCanvasRef.current?.renderAll();
        };
      };
    };

    e.target.value = "";
  };

  const switchBackGroundColor = () => {
    // cambio aleratorio de color de fondo del canvas
    fabricCanvasRef.current?.set(
      "backgroundColor",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
    fabricCanvasRef.current?.renderAll();
  };

  const addShadowToText = () => {
    // agregar sombra al obj text seleccionado, si tiene sombra, la saca
    objSelected.forEach((obj) => {
      if (obj.shadow) {
        obj.set("shadow", null);
      } else
        obj.set("shadow", {
          color: "black",
          blur: 3,
          offsetX: 2,
          offsetY: 2,
        });
    });
    fabricCanvasRef.current?.renderAll();
  };

  return (
    <div>
      <canvas ref={canvasRef} />
      <input type="file" onChange={handleImageUpload} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-row gap-2 w-full">
        <button
          onClick={() => {
            if (objSelected && objSelected?.length > 0) {
              objSelected.forEach((obj) => {
                if (obj.type !== "text") return;
                obj.set("text", text);
                obj.set(
                  "fill",
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                );
                obj.set("textAlign", "center");
              });
              fabricCanvasRef.current?.renderAll();
              return;
            }
            addText(text);
          }}
        >
          Aplicar texto
        </button>
        <button onClick={switchBackGroundColor}>Color de fondo</button>
        {objSelected.length > 0 && (
          <button onClick={addShadowToText}>Sombra</button>
        )}
      </div>
    </div>
  );
}
