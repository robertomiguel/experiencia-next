'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { removeBackground, preload } from "@imgly/background-removal";

export default function ImagePage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpuTier, setGpuTier] = useState<"high" | "medium" | "low" | null>(
    null
  );

  // Función para detectar capacidades GPU de manera más precisa
  const detectGPUCapabilities = async () => {
    try {
      // Verificar WebGPU
      if (typeof navigator !== "undefined" && "gpu" in navigator) {
        try {
          const adapter = await (navigator as any).gpu?.requestAdapter();
          if (adapter) {
            setGpuTier("high");
            return "high";
          }
        } catch (e) {
          console.log("WebGPU no disponible, intentando WebGL");
        }
      }

      // Verificar WebGL como fallback
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (gl) {
        const debugInfo = (gl as any).getExtension("WEBGL_debug_renderer_info");
        const renderer = debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : "";

        // Detectar GPUs potentes basado en el renderer string
        const isHighEnd = /(nvidia|radeon\s*rx|rtx)/i.test(renderer);
        setGpuTier(isHighEnd ? "high" : "medium");
        return isHighEnd ? "high" : "medium";
      }

      setGpuTier("low");
      return "low";
    } catch (e) {
      console.error("Error detectando GPU:", e);
      setGpuTier("low");
      return "low";
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        setLoading(true);
        setError(null);
        setImage(reader.result as string);

        // Configuración optimizada según las capacidades detectadas
        const config: any = {
          debug: true,
          device: gpuTier === "high" ? "gpu" : "cpu",
          model: gpuTier === "low" ? "small" : "medium",
          preferWebGPU: gpuTier === "high",
          output: {
            format: "image/png",
            type: "foreground",
          },
        };

        // Remover el fondo
        const blob = await removeBackground(reader.result as string, config);
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
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const detectedTier = await detectGPUCapabilities();

        // Configuración de preload basada en las capacidades detectadas
        const settings: any = {
          debug: false,
          device: detectedTier === "high" ? "gpu" : "cpu",
          preferWebGPU: detectedTier === "high",
          model: detectedTier === "low" ? "small" : "medium",
        };
        await preload(settings);
      } catch (error) {
        console.error("Error en la inicialización:", error);
        setError(
          `Error al inicializar: ${error instanceof Error ? error.message : "Error desconocido"}`
        );
      }
    };
    init();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold mb-6">Eliminar fondo de imagen</h1>

      {gpuTier && (
        <div
          className={`text-sm px-3 py-1 rounded ${
            gpuTier === "high"
              ? "bg-green-100 text-green-800"
              : gpuTier === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          Modo:{" "}
          {gpuTier === "high"
            ? "GPU (Alto Rendimiento)"
            : gpuTier === "medium"
              ? "GPU (Rendimiento Medio)"
              : "CPU (Rendimiento Básico)"}
        </div>
      )}

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Cargar imagen:
            <input
              type="file"
              onChange={handleUpload}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
            />
          </label>
        </div>

        {error && (
          <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>
        )}

        {loading && (
          <div className="text-center py-4 text-gray-600">
            Procesando imagen...{" "}
            {gpuTier === "low" && "(Esto podría tomar más tiempo en modo CPU)"}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Imagen Original</h3>
            {image ? (
              <Image
                src={image}
                width={512}
                height={300}
                alt="original"
                className="rounded-lg"
                style={{
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                No hay imagen seleccionada
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Imagen Sin Fondo</h3>
            {imageRemoved ? (
              <Image
                src={imageRemoved}
                width={512}
                height={300}
                alt="sin fondo"
                className="rounded-lg"
                style={{
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                No hay imagen procesada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}