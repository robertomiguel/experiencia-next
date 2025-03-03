import React, { useEffect, useRef } from "react";

// Ajustamos los límites de rotación para dar una sensación más suave
const MIN_ROTATION = 0;
const MAX_ROTATION = 330; // Ahora usamos casi una rotación completa (330 grados)

const KnobControl = ({
  defaultValue,
  minValue,
  maxValue,
  step = 1,
  onChange,
}: {
  defaultValue?: number;
  minValue: number;
  maxValue: number;
  step?: number;
  onChange?: (value: number) => void;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const valueDisplayRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef(0);
  const valueRef = useRef(minValue);
  const isDraggingRef = useRef(false);
  const prevMouseAngleRef = useRef(0);
  const accumulatedRotationRef = useRef(0); // Para seguir la rotación acumulada
  const rotationSensitivityRef = useRef(1.0); // Factor de sensibilidad (ajustable)

  // Convierte rotación (0-MAX_ROTATION) a valor (MIN-MAX)
  const rotationToValue = (rotation: number) => {
    const clampedRotation = Math.max(
      MIN_ROTATION,
      Math.min(MAX_ROTATION, rotation)
    );
    const rawValue =
      minValue + (clampedRotation / MAX_ROTATION) * (maxValue - minValue);
    // Aplica el step para redondear al incremento más cercano
    return Math.round(rawValue / step) * step;
  };

  const calculateAngle = (clientX: number, clientY: number) => {
    if (!divRef.current) return 0;

    const rect = divRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    return angle * (180 / Math.PI);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    const currentAngle = calculateAngle(e.clientX, e.clientY);
    prevMouseAngleRef.current = currentAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !divRef.current || !valueDisplayRef.current)
      return;

    const currentAngle = calculateAngle(e.clientX, e.clientY);

    // Calcular el cambio de ángulo, teniendo en cuenta el cruce del límite -180/180
    let deltaAngle = currentAngle - prevMouseAngleRef.current;

    // Detectar y corregir saltos cuando se cruza el límite -180/180
    if (deltaAngle > 180) {
      deltaAngle -= 360;
    } else if (deltaAngle < -180) {
      deltaAngle += 360;
    }

    // Aplicar sensibilidad para un control más fino o grueso
    deltaAngle *= rotationSensitivityRef.current;

    // Actualizar el ángulo previo para el siguiente movimiento
    prevMouseAngleRef.current = currentAngle;

    // Acumular la rotación teniendo en cuenta el cambio de ángulo
    accumulatedRotationRef.current += deltaAngle;

    // Limitar la rotación al rango permitido
    if (accumulatedRotationRef.current < MIN_ROTATION) {
      accumulatedRotationRef.current = MIN_ROTATION;
    } else if (accumulatedRotationRef.current > MAX_ROTATION) {
      accumulatedRotationRef.current = MAX_ROTATION;
    }

    // Aplicar la rotación acumulada
    rotateRef.current = accumulatedRotationRef.current;

    // Actualizar el valor basado en la rotación limitada
    valueRef.current = rotationToValue(rotateRef.current);

    // Actualizar el texto del valor directamente en el DOM
    // si tiene decimales se pueden mostrar con toFixed(2), si es entero no mostrar decimales
    const haveDecimals = Math.floor(valueRef.current) !== valueRef.current;
    
    valueDisplayRef.current.textContent = `${haveDecimals ? valueRef.current.toFixed(2) : valueRef.current}`;

    if (onChange) onChange(valueRef.current);

    // Actualizar directamente el estilo del elemento sin estado
    divRef.current.style.transform = `rotate(${rotateRef.current}deg)`;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    if (defaultValue) {
      const rotation =
        ((defaultValue - minValue) / (maxValue - minValue)) * MAX_ROTATION;
      accumulatedRotationRef.current = rotation;
      rotateRef.current = rotation;
      valueRef.current = defaultValue;
      if (divRef.current) {
        divRef.current.style.transform = `rotate(${rotateRef.current}deg)`;
      }
      if (valueDisplayRef.current) {
        valueDisplayRef.current.textContent = `${valueRef.current}`;
      }
    }
  }, [defaultValue, minValue, maxValue]);

  return (
    <div className="flex flex-col items-center gap-4 relative">
      <div className="-rotate-[165deg]">
        <div
          ref={divRef}
          className={`
        w-[100px]
        h-[100px]
        bg-[#3d404f]
        rounded-full
        shadow-md
        relative
        cursor-grab
        active:cursor-grabbing
        border-[1px]
        border-gray-200
        border-dashed
      `}
          style={{ transform: `rotate(0deg)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`
          w-[10px]
          h-[10px]
          bg-white
          rounded-full
          absolute
          top-1
          left-1/2
          transform
          -translate-x-1/2
        `}
          />
        </div>
      </div>
      <div
        ref={valueDisplayRef}
        className={`
        pointer-events-none
        select-none
        absolute
        top-1/2
        left-1/2
        transform
        -translate-x-1/2
        -translate-y-1/2
        font-[400]
      `}
      >
        {minValue}
      </div>
    </div>
  );
};

export default React.memo(KnobControl);
