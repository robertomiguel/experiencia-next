/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
} from "react";
import { Download, Upload, Edit, X } from "lucide-react";
import { sliderDefinitions, StyleState } from "./sliderDefinitions";
import { RenderSection } from "./renderSection";


const STYLE_BASE = {
  shadowEnabled: true,
  shadowBlur: 20,
  shadowColor: "rgba(0,0,0,0.6)",
  shadowOffsetX: 0,
  shadowOffsetY: 10,
  exposure: 100,
  contrast: 100,
  saturation: 100,
  shadows: 0,
  highlights: 0,
  whites: 0,
  blacks: 0,
  clarity: 0,
}

export const ImageEditor: React.FC = () => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [imgShadow, setImgShadow] = useState<string | null>(null);
  const [styleState, setStyleState] = useState<StyleState>(STYLE_BASE);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeSlider, setActiveSlider] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateStyle = useCallback(
    <T extends keyof StyleState>(key: T, value: StyleState[T]) => {
      setStyleState((prevState) => ({ ...prevState, [key]: value }));
    },
    []
  );
  
  const renderShadow = useCallback(() => {
    if (!img || !canvasRef.current) return;

    requestAnimationFrame(() => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const padding = Math.max(
          styleState.shadowBlur * 2,
          Math.abs(styleState.shadowOffsetX * 2),
          Math.abs(styleState.shadowOffsetY * 2),
          100 // Minimum padding to ensure there's always enough space
        );

        canvas.width = img.width + padding;
        canvas.height = img.height + padding;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (styleState.shadowEnabled) {
          ctx.shadowBlur = styleState.shadowBlur;
          ctx.shadowColor = styleState.shadowColor;
          ctx.shadowOffsetX = styleState.shadowOffsetX;
          ctx.shadowOffsetY = styleState.shadowOffsetY;
        }

        ctx.drawImage(img, padding / 2, padding / 2, img.width, img.height);

        const dataUrl = canvas.toDataURL();
        setImgShadow(dataUrl);
      } catch (err) {
        console.error("Error rendering shadow:", err);
      }
    });
  }, [img, styleState]);

  const debouncedShadowUpdate = useCallback(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    if (activeSlider) {
      renderShadow();
    } else {
      renderTimeoutRef.current = setTimeout(() => {
        renderShadow();
      }, 50);
    }
  }, [renderShadow, activeSlider]);

  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png" && file.type !== "image/webp") {
      alert("Por favor, sube solo imágenes PNG o WebP con transparencia");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setIsDrawerOpen(true);
      };
      image.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = useCallback(() => {
    if (!imgShadow) return;

    const link = document.createElement("a");
    link.href = imgShadow;
    link.download = "imagen_con_sombra.png";
    link.click();
  }, [imgShadow]);

  const getFilters = useMemo(() => {
    const {
      exposure,
      contrast,
      saturation,
      shadows,
      highlights,
      whites,
      blacks,
      clarity,
    } = styleState;

    let filter = `brightness(${exposure / 100}) contrast(${contrast}%) saturate(${saturation}%)`;

    if (shadows !== 0) {
      const value = shadows / 100;
      filter += ` brightness(${1 + value * 0.25})`;
    }

    if (highlights !== 0) {
      const value = highlights / 100;
      if (highlights > 0) filter += ` brightness(${1 + value * 0.15})`;
      else filter += ` brightness(${1 - Math.abs(value) * 0.05})`;
    }

    if (whites !== 0) {
      const value = whites / 100;
      if (whites > 0) filter += ` brightness(${1 + value * 0.25})`;
      else filter += ` brightness(${1 - Math.abs(value) * 0.1})`;
    }

    if (blacks !== 0) {
      const value = blacks / 100;
      if (blacks > 0) filter += ` brightness(${1 - value * 0.2})`;
      else filter += ` brightness(${1 + Math.abs(value) * 0.1})`;
    }

    if (clarity !== 0) {
      if (clarity > 0) filter += ` contrast(${100 + clarity * 0.5}%)`;
      else {
        const absValue = Math.abs(clarity);
        filter += ` contrast(${100 - absValue * 0.3}%)`;
        if (absValue > 50) filter += ` blur(${(absValue - 50) / 200}px)`;
      }
    }

    return filter;
  }, [styleState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        isDrawerOpen
      ) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (img) {
      debouncedShadowUpdate();
    }

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [img, styleState, debouncedShadowUpdate]);

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden text-blue-950">
      <div className="absolute inset-0 flex items-center justify-center">
        {imgShadow && (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={imgShadow}
              alt="Imagen con sombra"
              className="object-contain max-w-full max-h-full"
              style={{ maxWidth: "90%", maxHeight: "90%", filter: getFilters }}
            />
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-0 right-0 mx-auto flex justify-center gap-4 z-40">
        <button
          onClick={() => img && setIsDrawerOpen(!isDrawerOpen)}
          className={`
            p-2
            rounded-full
            shadow-lg
            ${
              img
                ? "bg-white text-gray-700 hover:bg-gray-100"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
          disabled={!img}
          aria-label="Editar imagen"
        >
          <Edit size={20} />
        </button>
        <label className="bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-100 cursor-pointer m-0 flex items-center justify-center">
          <Upload size={20} />
          <input
            type="file"
            accept="image/png, image/webp"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Subir imagen"
          />
        </label>
        <button
          onClick={handleDownload}
          className={`p-2 rounded-full shadow-lg ${imgShadow ? "bg-white text-gray-700 hover:bg-gray-100" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          disabled={!imgShadow}
          aria-label="Descargar imagen"
        >
          <Download size={20} />
        </button>
      </div>

      {/* Settings drawer */}
      {isDrawerOpen && img && (
        <div
          ref={drawerRef}
          className={`absolute top-0 left-0 h-full ${activeSlider ? "" : "bg-white"} shadow-lg z-50 w-64 overflow-auto`}
          role="dialog"
          aria-label="Panel de edición"
        >
          <div className="p-4 relative">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              aria-label="Cerrar panel"
            >
              <X size={16} />
            </button>
            <RenderSection
              title="Ajustes de sombra"
              sliders={sliderDefinitions.shadow}
              section="shadow"
              styleState={styleState}
              updateStyle={updateStyle}
              setActiveSlider={setActiveSlider}
              activeSlider={activeSlider}
            />
            <RenderSection
              title="Ajustes de tono"
              sliders={sliderDefinitions.tones}
              section="tones"
              styleState={styleState}
              updateStyle={updateStyle}
              setActiveSlider={setActiveSlider}
              activeSlider={activeSlider}
            />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />
    </div>
  );
};
