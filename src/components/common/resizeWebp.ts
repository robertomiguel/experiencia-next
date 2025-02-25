/**
 * Redimensiona una imagen manteniendo la relación de aspecto y optimizando la calidad de color
 * Utiliza WebP como formato de salida para combinar las ventajas de JPEG (colores) y PNG (transparencia)
 *
 * @param base64Str - Imagen en formato base64
 * @param maxWidth - Ancho máximo de la imagen resultante
 * @param maxHeight - Alto máximo de la imagen resultante
 * @param quality - Calidad de la imagen (0-1), donde 1 es máxima calidad
 * @returns Promise que resuelve a una imagen WebP en formato base64
 */
export const resizeImageToWebP = async (
  base64Str: string,
  maxWidth = 400,
  maxHeight = 350,
  quality = 0.92
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Verificar compatibilidad con WebP
    const isWebPSupported = () => {
      const canvas = document.createElement("canvas");
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    };

    // Crear imagen a partir del base64
    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      try {
        // Obtener dimensiones originales
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Calcular nuevas dimensiones manteniendo la relación de aspecto
        let width = originalWidth;
        let height = originalHeight;

        // Usar algoritmo de redimensionamiento preciso
        const ratioWidth = maxWidth / width;
        const ratioHeight = maxHeight / height;
        const ratio = Math.min(ratioWidth, ratioHeight);

        // Solo reducir si es necesario (ratio < 1)
        if (ratio < 1) {
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // Crear canvas de alta calidad
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Obtener contexto optimizado para preservar colores
        const ctx = canvas.getContext("2d", {
          alpha: true,
          colorSpace: "srgb", // Espacio de color estándar para mejor reproducción
          willReadFrequently: false, // Optimización de rendimiento
        });

        if (!ctx) {
          throw new Error("No se pudo crear el contexto 2D");
        }

        // Optimizaciones para máxima calidad visual
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Limpiar canvas para transparencia si la imagen la soporta
        ctx.clearRect(0, 0, width, height);

        // Dibujar imagen preservando colores y detalles
        ctx.drawImage(img, 0, 0, width, height);

        // Determinar el formato de salida
        if (isWebPSupported()) {
          // Usar WebP si está disponible
          resolve(canvas.toDataURL("image/webp", quality));
        } else {
          // Fallback a PNG si WebP no está disponible
          console.warn(
            "WebP no soportado por el navegador, usando PNG como alternativa"
          );
          resolve(canvas.toDataURL("image/png"));
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };

    img.onerror = () => {
      reject(new Error("Error al cargar la imagen"));
    };
  });
};

/**
 * Determina si una imagen tiene canal alfa (transparencia)
 * @param base64Str - Imagen en formato base64
 * @returns Promise que resuelve a true si la imagen tiene transparencia
 */
export const hasTransparency = async (base64Str: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      try {
        // Crear un pequeño canvas para analizar la imagen
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(img.width, 50); // Limitamos el tamaño para rendimiento
        canvas.height = Math.min(img.height, 50);

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          resolve(false);
          return;
        }

        // Limpiar el canvas (totalmente transparente)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar la imagen
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Obtener los datos de la imagen
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Buscar píxeles con transparencia (canal alfa < 255)
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) {
            resolve(true);
            return;
          }
        }

        resolve(false);
      } catch (error) {
        // Si hay un error, asumimos que no hay transparencia
        resolve(false);
      }
    };

    img.onerror = () => {
      reject(new Error("Error al cargar la imagen"));
    };
  });
};

/**
 * Función inteligente que elige el mejor formato según el contenido de la imagen
 * @param base64Str - Imagen en formato base64
 * @param maxWidth - Ancho máximo de la imagen resultante
 * @param maxHeight - Alto máximo de la imagen resultante
 * @returns Promise que resuelve a una imagen optimizada en formato base64
 */
export const smartResizeImage = async (
  base64Str: string,
  maxWidth = 400,
  maxHeight = 350
): Promise<string> => {
  try {
    // Si la imagen tiene transparencia, usamos WebP con alta calidad
    const hasAlpha = await hasTransparency(base64Str);

    if (hasAlpha) {
      return resizeImageToWebP(base64Str, maxWidth, maxHeight, 0.95);
    } else {
      // Para imágenes sin transparencia, WebP con calidad ligeramente menor es suficiente
      return resizeImageToWebP(base64Str, maxWidth, maxHeight, 0.9);
    }
  } catch (error) {
    console.error("Error en smartResizeImage:", error);
    // Si hay algún error, volvemos al método básico
    return resizeImageToWebP(base64Str, maxWidth, maxHeight, 0.92);
  }
};
