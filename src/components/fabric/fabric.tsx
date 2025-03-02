"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "./deviceDetection";
import { useFabricCanvas } from "./hooks/useFabricCanvas";
import { useFabricObjects } from "./hooks/useFabricObjects";
import { useFabricTrashBin } from "./hooks/useFabricTrashBin";
import { useSelectionEvents } from "./hooks/useSelectionEvents";
import { useTextInteraction } from "./hooks/useTextInteraction";
import TrashBin from "./TrashBin";
import FabricToolbar from "./FabricToolbar";

const Fabric: React.FC = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Hooks personalizados
  const {
    canvasRef,
    fabricCanvasRef,
    isFabricLoaded,
    clearCanvas,
    switchBackGroundColor,
  } = useFabricCanvas();
  const { addRectangle, addText, addImage } = useFabricObjects(fabricCanvasRef);
  const { showTrashBin, isOverTrashBin, trashBinRef } =
    useFabricTrashBin(fabricCanvasRef);
  const { selectedObject } = useSelectionEvents(fabricCanvasRef);

  // Usar el hook para mejorar la interacción con textos
  useTextInteraction(fabricCanvasRef);

  // Asegúrate de que el canvas se renderice cuando esté listo
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.renderAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricCanvasRef.current]);

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
    [addImage]
  );

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
            <TrashBin
              show={showTrashBin}
              isOver={isOverTrashBin}
              trashBinRef={
                trashBinRef as React.MutableRefObject<HTMLDivElement>
              }
            />
          </div>

          <FabricToolbar
            onAddRectangle={addRectangle}
            onAddText={addText}
            onUploadImage={() => inputFileRef.current?.click()}
            onChangeBackground={switchBackGroundColor}
            onClearCanvas={clearCanvas}
            selectedObject={selectedObject}
          />
        </>
      )}
    </div>
  );
};

export default Fabric;
