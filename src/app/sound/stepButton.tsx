import { FC, memo } from "react";
import { StepButtonProps } from "./types";

export const StepButton: FC<StepButtonProps> = memo(
  ({ stepIndex, isActive, isCurrent, onClick }) => {
    const group = Math.floor(stepIndex / 4); // 0..3
    const groupColors = [
      "border-[#e56655]", // group 0: steps 0..3
      "border-[#fea75a]", // group 1: steps 4..7
      "border-[#fdff82]", // group 2: steps 8..11
      "border-[#fffffd]", // group 3: steps 12..15
    ];

    return (
      <div
        onClick={onClick}
        data-step={stepIndex}
        data-enabled={isActive ? "true" : "false"}
        className={`rounded-full w-8 h-8 cursor-pointer border-2 bg-transparent text-xs ${groupColors[group]}`}
      />
    );
  },
  (prev, next) => {
    // Retornar true si las props no han cambiado (no re-renderizar)
    // Retornar false si las props han cambiado (sí re-renderizar)
    return (
      prev.isActive === next.isActive &&
      prev.isCurrent === next.isCurrent &&
      prev.stepIndex === next.stepIndex
    );
  }
);

StepButton.displayName = "StepButton";
