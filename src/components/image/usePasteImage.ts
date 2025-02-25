import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para detectar y manejar imágenes pegadas desde el portapapeles.
 *
 * @param onImagePaste - Función callback que se ejecuta cuando se pega una imagen
 * @returns Un objeto con el estado actual del hook
 */
const usePasteImage = (onImagePaste: (imageDataUrl: string) => void) => {
  const [isPasting, setIsPasting] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);

  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      try {
        setIsPasting(true);
        setPasteError(null);

        const items = event.clipboardData?.items;
        if (!items) {
          setPasteError("No se pudo acceder al portapapeles");
          return;
        }

        // Buscamos un item de tipo imagen en el portapapeles
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (!blob) {
              setPasteError("No se pudo obtener la imagen del portapapeles");
              continue;
            }

            // Convertimos el blob a base64
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                onImagePaste(reader.result);
              } else {
                setPasteError("Error al convertir la imagen");
              }
              setIsPasting(false);
            };

            reader.onerror = () => {
              setPasteError("Error al leer la imagen del portapapeles");
              setIsPasting(false);
            };

            reader.readAsDataURL(blob);
            return; // Salimos después de encontrar y procesar una imagen
          }
        }

        // Si llegamos aquí es porque no encontramos ninguna imagen
        setPasteError("No se encontró ninguna imagen en el portapapeles");
        setIsPasting(false);
      } catch (error) {
        setPasteError(
          `Error al procesar la imagen pegada: ${error instanceof Error ? error.message : "Error desconocido"}`
        );
        setIsPasting(false);
      }
    },
    [onImagePaste]
  );

  useEffect(() => {
    // Añadimos el listener para el evento paste
    document.addEventListener("paste", handlePaste);

    // Limpiamos el listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return { isPasting, pasteError, setPasteError };
};

export default usePasteImage;
