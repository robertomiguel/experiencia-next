"use client";
import { useEffect, useState } from "react";
import { ImageBox } from "./imagexBox";
import { FileBox } from "./fileBox";
import { detectGPUCapabilities } from "./detectGPUCapabilities";
import DragSlider from "./dragSlider";
import { Spinner } from "../common/Spinner";
import usePasteImage from "./usePasteImage"; // Importamos nuestro nuevo hook

// Definimos un tipo para las funciones que vamos a importar dinámicamente
type BackgroundRemovalType = {
  removeBackground: (image: string, config?: any) => Promise<Blob>;
  preload: (config?: any) => Promise<void>;
};

export default function ImagePage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState();
  const [backgroundRemoval, setBackgroundRemoval] =
    useState<BackgroundRemovalType | null>(null);

  // Función para procesar una imagen (tanto subida como pegada)
  const processImage = async (imageData: string) => {
    if (!backgroundRemoval) {
      setError("El módulo de eliminación de fondo no está listo");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImage(imageData);

      const blob = await backgroundRemoval.removeBackground(imageData, config);

      const url = URL.createObjectURL(blob);
      setImageRemoved(url);
    } catch (error) {
      setError(
        `Error al procesar la imagen: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
      console.error("Error en procesamiento:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hook para manejar imágenes pegadas
  const { isPasting, pasteError, setPasteError } = usePasteImage(
    (pastedImageData) => {
      processImage(pastedImageData);
    }
  );

  // Actualizamos la función de carga para usar la función processImage común
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        processImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Función para cargar la biblioteca de manera dinámica
  const loadBackgroundRemoval = async () => {
    try {
      const bgRemovalLib = await import("@imgly/background-removal");
      setBackgroundRemoval({
        removeBackground: bgRemovalLib.removeBackground,
        preload: bgRemovalLib.preload,
      });
    } catch (error) {
      console.error("Error loading background removal module:", error);
      setError("Error al cargar el módulo de eliminación de fondo");
    }
  };

  useEffect(() => {
    console.log("Inicializando...Init");

    const init = async () => {
      try {
        await loadBackgroundRemoval();
        const detectedTier = await detectGPUCapabilities();
        const config: any = {
          debug: false,
          device: detectedTier === "high" ? "gpu" : "cpu",
          model: detectedTier === "low" ? "small" : "medium",
          preferWebGPU: detectedTier === "high",
          output: {
            format: "image/webp",
            type: "foreground",
          },
        };
        setConfig(config);

        if (backgroundRemoval) {
          const settings = {
            debug: false,
            device: detectedTier === "high" ? "gpu" : "cpu",
            preferWebGPU: detectedTier === "high",
            model: detectedTier === "low" ? "small" : "medium",
          };
          await backgroundRemoval.preload(settings);
        }
      } catch (error) {
        console.error("Error en la inicialización:", error);
        setError(
          `Error al inicializar: ${error instanceof Error ? error.message : "Error desconocido"}`
        );
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizamos los errores del hook de pegado con el estado de error general
  useEffect(() => {
    if (pasteError) {
      setError(pasteError);
      // Limpiamos el error del hook para evitar duplicaciones
      setPasteError(null);
    }
  }, [pasteError, setPasteError]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:px-8 w-full">
      <h1 className="text-[20px] font-bold">Eliminar fondo de imagen</h1>

      <div className="w-full bg-blue-800 p-2 md:p-4 rounded-lg shadow-md">
        <FileBox onChange={handleUpload} />

        {/* Instrucciones de pegar imagen */}
        <div className="text-white mt-2 mb-3 text-center border border-blue-300 rounded-lg p-2">
          <p>También puedes pegar una imagen directamente (Ctrl+V / Cmd+V)</p>
          {isPasting && (
            <span className="block mt-1">Procesando imagen pegada...</span>
          )}
        </div>

        {error && (
          <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>
        )}

        <div className="w-full mt-4">
          {!loading && !isPasting && image && (
            <DragSlider
              leftContent={
                <ImageBox
                  image={image}
                  label="Imagen Original"
                  noImage="No hay imagen cargada"
                />
              }
              rightContent={
                <ImageBox
                  image={imageRemoved}
                  label="Imagen con fondo eliminado"
                  noImage="No hay imagen procesada"
                />
              }
            />
          )}
          {(loading || isPasting) && <Spinner color="border-blue-500" />}
        </div>
      </div>
    </div>
  );
}
