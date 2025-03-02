// TrashBin.tsx
import React from "react";

interface TrashBinProps {
  show: boolean;
  isOver: boolean;
  trashBinRef: React.RefObject<HTMLDivElement>;
}

const TrashBin: React.FC<TrashBinProps> = ({ show, isOver, trashBinRef }) => {
  if (!show) return null;

  return (
    <div
      ref={trashBinRef}
      className={`border-1 border-white absolute cursor-pointer bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 flex items-center justify-center rounded-full ${
        isOver ? "bg-[rgba(255,0,0,0.5)] scale-110" : "bg-[rgba(0,0,0,0.2)]"
      } transition-all duration-200 shadow-lg z-50`}
      data-testid="trash-bin"
    >
      <span
        className="text-4xl cursor-pointer"
        style={{
          fontSize: isOver ? "2.75rem" : "2.25rem",
          transition: "all 0.2s ease",
          filter: isOver
            ? "drop-shadow(0 0 3px rgba(255,255,255,0.8))"
            : "none",
        }}
      >
        🗑️
      </span>
    </div>
  );
};

export default TrashBin;