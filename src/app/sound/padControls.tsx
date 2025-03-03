import { FC, memo, useState } from "react";
import { PadControlsProps } from "./types";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import KnobControl from "./knobControl";

export const PadControls: FC<PadControlsProps> = memo(
  ({ padName, controls, onControlChange }) => {
    const [show, setShow] = useState(false);

    const controlKeys = Object.keys(controls || {});

    function getRange(ctrl: string) {
      switch (ctrl) {
        case "decay":
          return { min: 0, max: 2 };
        case "tone":
        case "level":
        case "snappy":
        case "reverb":
        case "tuning":
          return { min: 0, max: 1 };
        default:
          return { min: 0, max: 1 };
      }
    }

    return (
      <div className="relative">
        <div
          onClick={() => setShow((prev) => !prev)}
          className="p-2"
        >
          {show ? <CircleArrowUp /> : <CircleArrowDown />}
        </div>
        {show && (
          <div className="absolute mt-2 bg-gray-800 p-2 rounded w-[300px] z-10 border-2 border-gray-400 shadow-lg ">
            {controlKeys.length === 0 ? (
              <p className="text-xs text-gray-400">No tiene controles</p>
            ) : (
              controlKeys.map((ck) => {
                const { min, max } = getRange(ck);
                const val = controls[ck];
                return (
                  <div key={ck} className="flex items-center mb-2">
                    <label className="w-16 text-xs mr-2">
                      {ck.toUpperCase()}
                    </label>
                    
                    <KnobControl
                      defaultValue={val}
                      minValue={min}
                      maxValue={max}
                      step={0.01}
                      onChange={(nro) =>
                        onControlChange(padName, ck, nro)
                      }
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  },
  (prev, next) => {
    if (
      Object.keys(prev.controls).length !== Object.keys(next.controls).length
    ) {
      return false;
    }
    for (let k of Object.keys(prev.controls)) {
      if (prev.controls[k] !== next.controls[k]) {
        return false;
      }
    }
    return true;
  }
);

PadControls.displayName = "PadControls";