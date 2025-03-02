// FabricToolbar.tsx
import React from "react";

interface FabricToolbarProps {
  onAddRectangle: () => void;
  onAddText: () => void;
  onUploadImage: () => void;
  onChangeBackground: () => void;
  onClearCanvas: () => void;
  selectedObject: any;
}

const FabricToolbar: React.FC<FabricToolbarProps> = ({
  onAddRectangle,
  onAddText,
  onUploadImage,
  onChangeBackground,
  onClearCanvas,
  selectedObject,
}) => {
  return (
    <>
      <div>
        {selectedObject && (
          <div className="mt-4 space-x-2">
            Seleccionado: {selectedObject.type}
          </div>
        )}
      </div>
      <div className="mt-4 w-full flex flex-wrap justify-center items-center flex-row gap-4">
        <button
          className="bg-transparent w-fit h-fit rounded-full"
          onClick={onAddRectangle}
        >
          Cuadrado 🟦
        </button>
        <button
          className="bg-transparent w-fit h-fit rounded-full"
          onClick={onAddText}
        >
          Texto ✏
        </button>
        <button
          className="bg-transparent w-fit h-fit rounded-full"
          onClick={onUploadImage}
        >
          Imagen 🖼
        </button>
        <button
          className="bg-transparent w-fit h-fit rounded-full"
          onClick={onChangeBackground}
        >
          Fondo 🌈
        </button>
        <button
          className="bg-transparent w-fit h-fit rounded-full"
          onClick={onClearCanvas}
        >
          Limpiar 🧹
        </button>
      </div>
    </>
  );
};

export default FabricToolbar;