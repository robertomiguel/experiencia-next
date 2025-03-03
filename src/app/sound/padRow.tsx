import { FC, memo, useRef, useState } from "react";
import { padColors } from "./setting";
import { StepButton } from "./stepButton";
import { PadControls } from "./padControls";
import { Volume2, VolumeOff } from "lucide-react";

// Modificamos las props para eliminar currentStep
export interface OptimizedPadRowProps {
  padName: string;
  label: string;
  sequence: boolean[];
  controls: Record<string, number>;
  onToggleStep: (padName: string, stepIndex: number) => void;
  onToggleEnabled: (padName: string) => void;
  onControlChange: (padName: string, control: string, value: number) => void;
}

export const PadRow: FC<OptimizedPadRowProps> = memo(
  ({
    padName,
    label,
    sequence,
    controls,
    onToggleStep,
    onToggleEnabled,
    onControlChange,
  }) => {
    const [enabled, setEnabled] = useState(true);

    return (
      <div className="flex flex-row gap-2 justify-start items-center">
        <div className="flex items-center mb-2">
          <div
            className="cursor-pointer p-2"
            onClick={() => {
              onToggleEnabled(padName)
              setEnabled(!enabled)
            }}
          >
            {enabled && <Volume2 />}
            {!enabled && <VolumeOff />}
          </div>
          <PadControls
            padName={padName}
            controls={controls}
            onControlChange={onControlChange}
          />
          <div
            className={`p-2 text-center ${padColors[padName]} rounded-lg whitespace-nowrap w-[150px]`}
          >
            {label}
          </div>
        </div>

        {/* Secuenciador de 16 pasos - Ahora con atributos data para manipulación DOM */}
        <div className="flex flex-wrap gap-2">
          {sequence.map((active, idx) => {
            return (
              <div key={idx} data-step={idx} className="step-button-wrapper">
                <StepButton
                  stepIndex={idx}
                  isActive={active}
                  isCurrent={false} // Siempre es false, gestionado por DOM
                  onClick={() => onToggleStep(padName, idx)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  (prev, next) => {
    // Verificar propiedades primitivas que afectan la visualización
    if (prev.padName !== next.padName) return false;
    if (prev.label !== next.label) return false;
    // if (prev.enabled !== next.enabled) return false;

    // Ya no necesitamos verificar currentStep    

    // Verificar la secuencia de pasos
    if (prev.sequence.length !== next.sequence.length) return false;
    for (let i = 0; i < prev.sequence.length; i++) {
      if (prev.sequence[i] !== next.sequence[i]) {
        return false;
      }
    }

    // Verificar los controles
    const prevControlKeys = Object.keys(prev.controls);
    const nextControlKeys = Object.keys(next.controls);

    if (prevControlKeys.length !== nextControlKeys.length) return false;

    for (const key of prevControlKeys) {
      if (prev.controls[key] !== next.controls[key]) {
        return false;
      }
    }

    // Si llegamos hasta aquí, no hay cambios que requieran una renderización
    return true;
  }
);

PadRow.displayName = "PadRow";
