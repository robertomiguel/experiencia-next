"use client";
import "./page.css";

import React, { useEffect, useRef, useState } from "react";
import { Eraser, RotateCcw, Trash2, Save, Undo, Redo } from "lucide-react";
import useCanvasTrim from "@/components/common/useCanvasTrim";

const ImageEditor: React.FC = () => {
  // Referencias a los elementos DOM
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusTextRef = useRef<HTMLParagraphElement>(null);
  const undoBtnRef = useRef<HTMLButtonElement>(null);
  const redoBtnRef = useRef<HTMLButtonElement>(null);
  const sizeValueRef = useRef<HTMLSpanElement>(null);

  // Estado
  const [currentTool, setCurrentTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(20);
  const [status, setStatus] = useState("Esperando imagen...");

  // Variables que no necesitan re-renderizar el componente
  const isDrawingRef = useRef(false);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const cursorIndicatorRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const historyLimitRef = useRef(20);

  // Inicialización
  useEffect(() => {
    // Inicializar el lienzo principal
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0)"; // Transparente
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    // Crear dos capas: una para la imagen original y otra para las ediciones
    const originalCanvas = document.createElement("canvas");
    const originalCtx = originalCanvas.getContext("2d");
    originalCanvasRef.current = originalCanvas;
    originalCtxRef.current = originalCtx;

    // Crear un indicador visual personalizado para el cursor
    const cursorIndicator = document.createElement("div");
    cursorIndicator.style.position = "fixed";
    cursorIndicator.style.pointerEvents = "none";
    cursorIndicator.style.zIndex = "1000";
    cursorIndicator.style.borderRadius = "50%";
    cursorIndicator.style.border = "2px solid red";
    cursorIndicator.style.display = "none";
    cursorIndicator.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(cursorIndicator);
    cursorIndicatorRef.current = cursorIndicator;

    // Inicializar botones de historia
    updateHistoryButtons();

    // Cleanup al desmontar el componente
    return () => {
      if (cursorIndicatorRef.current) {
        document.body.removeChild(cursorIndicatorRef.current);
      }
    };
  }, []);

  // Actualizar el estado cuando cambia
  useEffect(() => {
    if (statusTextRef.current) {
      statusTextRef.current.textContent = status;
    }
  }, [status]);

  // Función para mostrar un indicador de carga
  const showLoading = () => {
    const loading = document.createElement("div");
    loading.className = "loading";
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
    return loading;
  };

  const hideLoading = (loading: HTMLElement) => {
    if (loading) {
      document.body.removeChild(loading);
    }
  };

  // Eventos del botón de carga
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setStatus("Error: Por favor sube una imagen PNG o WebP.");
      return;
    }

    const loading = showLoading();

    const reader = new FileReader();
    reader.onload = function (event) {
      if (!event.target?.result) return;

      const img = new Image();
      img.onload = function () {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Ajustar el tamaño del canvas si es necesario
        if (img.width > 800 || img.height > 600) {
          const ratio = Math.min(800 / img.width, 600 / img.height);
          canvasRef.current.width = img.width * ratio;
          canvasRef.current.height = img.height * ratio;
        } else {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
        }

        // Configurar el canvas original con el mismo tamaño
        if (originalCanvasRef.current && originalCtxRef.current) {
          originalCanvasRef.current.width = canvasRef.current.width;
          originalCanvasRef.current.height = canvasRef.current.height;

          // Limpiar y dibujar la imagen en ambos canvas
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          originalCtxRef.current.clearRect(
            0,
            0,
            originalCanvasRef.current.width,
            originalCanvasRef.current.height
          );

          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          originalCtxRef.current.drawImage(
            img,
            0,
            0,
            originalCanvasRef.current.width,
            originalCanvasRef.current.height
          );

          // Guardar el estado actual
          saveState();
        }

        setStatus("Imagen cargada correctamente.");
        hideLoading(loading);
      };
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Cambiar herramientas
  const handleBrushClick = () => {
    setActiveTool("brush");
  };

  const handleRestoreClick = () => {
    setActiveTool("restore");
  };

  // Función para cambiar la herramienta activa
  const setActiveTool = (tool: string) => {
    setCurrentTool(tool);

    // Actualizar el color del cursor
    if (
      cursorIndicatorRef.current &&
      cursorIndicatorRef.current.style.display === "block"
    ) {
      cursorIndicatorRef.current.style.borderColor =
        tool === "brush" ? "red" : "green";
    }
  };

  // Actualizar el cursor cuando cambie el tamaño
  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setBrushSize(size);

    if (sizeValueRef.current) {
      sizeValueRef.current.textContent = size + "px";
    }

    // Actualizar tamaño del cursor si está visible
    if (
      cursorIndicatorRef.current &&
      cursorIndicatorRef.current.style.display === "block"
    ) {
      cursorIndicatorRef.current.style.width = size + "px";
      cursorIndicatorRef.current.style.height = size + "px";
    }
  };

  // Función para actualizar el cursor personalizado
  const updateCursor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cursorIndicatorRef.current) return;

    const size = brushSize;

    // Posicionar el cursor exactamente en la posición del ratón usando fixed
    cursorIndicatorRef.current.style.width = size + "px";
    cursorIndicatorRef.current.style.height = size + "px";
    cursorIndicatorRef.current.style.left = e.clientX + "px";
    cursorIndicatorRef.current.style.top = e.clientY + "px";

    // Cambiar el color según la herramienta
    cursorIndicatorRef.current.style.borderColor =
      currentTool === "brush" ? "red" : "green";
  };

  // Mostrar el cursor personalizado solo cuando el ratón está sobre el canvas
  const handleCanvasMouseEnter = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cursorIndicatorRef.current) return;

    cursorIndicatorRef.current.style.display = "block";
    updateCursor(e);
  };

  // Mantener actualizada la posición del cursor mientras se mueve
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Solo actualizar si el cursor está visible
    if (
      cursorIndicatorRef.current &&
      cursorIndicatorRef.current.style.display === "block"
    ) {
      updateCursor(e);
    }

    draw(e);
  };

  const handleCanvasMouseLeave = () => {
    if (!cursorIndicatorRef.current) return;

    cursorIndicatorRef.current.style.display = "none";
  };

  // Eventos del lienzo para dibujar
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = brushSize;

    if (currentTool === "brush") {
      // Borrar con bordes difuminados
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)"); // Centro completamente opaco
      gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.7)"); // Comienza a difuminar
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Borde completamente transparente

      // Guardar el estado actual del canvas
      ctx.save();

      // Definir una operación de composición que borrará basada en la opacidad
      ctx.globalCompositeOperation = "destination-out";

      // Dibujar el círculo con el gradiente
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Restaurar el estado del canvas
      ctx.restore();
    } else if (
      currentTool === "restore" &&
      originalCanvasRef.current &&
      originalCtxRef.current
    ) {
      // Restaurar con bordes difuminados

      // Crear un canvas temporal para la operación de restauración circular
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        // Copiar los datos del canvas original al temporal
        const originalData = originalCtxRef.current.getImageData(
          x - size / 2,
          y - size / 2,
          size,
          size
        );
        tempCtx.putImageData(originalData, 0, 0);

        // Crear un segundo canvas temporal para aplicar el gradiente
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = size;
        maskCanvas.height = size;
        const maskCtx = maskCanvas.getContext("2d");

        if (maskCtx) {
          // Crear un gradiente radial para el difuminado de bordes
          const gradient = maskCtx.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
          );
          gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Centro completamente opaco
          gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.7)"); // Comienza a difuminar
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Borde completamente transparente

          // Dibujar el círculo con el gradiente
          maskCtx.fillStyle = gradient;
          maskCtx.fillRect(0, 0, size, size);

          // Guardar el estado del contexto
          ctx.save();

          // Usar modo de composición que respeta la transparencia
          tempCtx.globalCompositeOperation = "destination-in";
          tempCtx.drawImage(maskCanvas, 0, 0);

          // Dibujar el canvas temporal en el principal
          ctx.drawImage(tempCanvas, x - size / 2, y - size / 2);

          // Restaurar el estado del contexto
          ctx.restore();
        }
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      saveState();
    }
  };

  // Eventos táctiles
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (cursorIndicatorRef.current) {
      cursorIndicatorRef.current.style.display = "none"; // Ocultar cursor en táctil
    }

    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as React.MouseEvent<HTMLCanvasElement>;

    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as React.MouseEvent<HTMLCanvasElement>;

    draw(mouseEvent);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  // Botón para limpiar todo
  const handleClearClick = () => {
    if (!canvasRef.current) return;

    if (window.confirm("¿Estás seguro de que quieres borrar toda la imagen?")) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        saveState();
        setStatus(
          'Imagen borrada. Usa la herramienta "Restaurar" para recuperarla.'
        );
      }
    }
  };

  const { downloadTrimmedImage } = useCanvasTrim();

  // Botón para guardar
  const handleSaveClick = () => {
    if (!canvasRef.current) return;
    downloadTrimmedImage(canvasRef.current);
    setStatus("Imagen guardada correctamente.");
  };

  // Funciones de historia
  const saveState = () => {
    if (!canvasRef.current) return;

    // Limitar el tamaño del historial
    if (historyRef.current.length >= historyLimitRef.current) {
      historyRef.current.shift(); // Elimina el estado más antiguo
    }

    const imageData = canvasRef.current.toDataURL();
    historyRef.current.push(imageData);
    redoStackRef.current = []; // Limpia la pila de rehacer

    // Actualizar el estado de los botones
    updateHistoryButtons();
  };

  const updateHistoryButtons = () => {
    if (undoBtnRef.current) {
      undoBtnRef.current.disabled = historyRef.current.length <= 1;
    }

    if (redoBtnRef.current) {
      redoBtnRef.current.disabled = redoStackRef.current.length === 0;
    }
  };

  // Botón de deshacer
  const handleUndoClick = () => {
    if (historyRef.current.length <= 1) return;

    // Guardar el estado actual para rehacer
    redoStackRef.current.push(historyRef.current.pop()!);

    // Cargar el estado anterior
    const prevState = historyRef.current[historyRef.current.length - 1];
    loadImageFromState(prevState);

    updateHistoryButtons();
    setStatus("Acción deshecha.");
  };

  // Botón de rehacer
  const handleRedoClick = () => {
    if (redoStackRef.current.length === 0) return;

    // Obtener el estado de rehacer
    const redoState = redoStackRef.current.pop()!;

    // Guardar el estado actual en el historial
    historyRef.current.push(redoState);

    // Cargar el estado de rehacer
    loadImageFromState(redoState);

    updateHistoryButtons();
    setStatus("Acción rehecha.");
  };

  const loadImageFromState = (state: string) => {
    if (!canvasRef.current) return;

    const img = new Image();
    img.onload = function () {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = state;
  };

  return (
    <div className="container">
      <h1>Editor de Imágenes con Transparencia</h1>

      <div className="upload-section">
        <p>Sube una imagen PNG o WebP con transparencia</p>
        <input
          type="file"
          id="file-input"
          ref={fileInputRef}
          accept=".png,.webp"
          onChange={handleFileChange}
        />
        <button
          className="upload-button"
          id="upload-btn"
          onClick={handleUploadClick}
        >
          Seleccionar Imagen
        </button>
        <p className="status" id="status" ref={statusTextRef}>
          {status}
        </p>
      </div>

      <div className="tools">
        <button
          className={`tool-button ${currentTool === "brush" ? "active" : ""}`}
          id="brush"
          onClick={handleBrushClick}
        >
          <Eraser size={16} />
          Borrador
        </button>
        <button
          className={`tool-button ${currentTool === "restore" ? "active" : ""}`}
          id="restore"
          onClick={handleRestoreClick}
        >
          <RotateCcw size={16} />
          Restaurar
        </button>
        <button className="tool-button" id="clear" onClick={handleClearClick}>
          <Trash2 size={16} />
          Limpiar Todo
        </button>
        <button className="tool-button" id="save" onClick={handleSaveClick}>
          <Save size={16} />
          Guardar Imagen
        </button>
      </div>

      <div className="brush-size text-[#1c1c1c]">
        <span>Tamaño del borrador:</span>
        <input
          type="range"
          id="brush-size"
          min="1"
          max="50"
          value={brushSize}
          onChange={handleBrushSizeChange}
        />
        <span id="size-value" ref={sizeValueRef}>
          {brushSize}px
        </span>
      </div>

      <div className="canvas-container">
        <canvas
          id="canvas"
          ref={canvasRef}
          width="512"
          height="678"
          onMouseDown={startDrawing}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseEnter={handleCanvasMouseEnter}
          onMouseLeave={handleCanvasMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      <div className="history-container">
        <button
          className="tool-button"
          id="undo"
          ref={undoBtnRef}
          onClick={handleUndoClick}
        >
          <Undo size={16} />
          Deshacer
        </button>
        <button
          className="tool-button"
          id="redo"
          ref={redoBtnRef}
          onClick={handleRedoClick}
        >
          <Redo size={16} />
          Rehacer
        </button>
      </div>

      <div className="footer">
        <p>Puedes borrar partes de la imagen y restaurarlas cuando quieras.</p>
      </div>
    </div>
  );
};

export default ImageEditor;