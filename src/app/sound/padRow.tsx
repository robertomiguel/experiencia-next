import { FC, memo, useState } from 'react'
import { padColors } from './setting'
import { StepButton } from './stepButton'
import { PadControls } from './padControls'
import { Volume2, VolumeOff } from 'lucide-react'

export interface OptimizedPadRowProps {
  playKey: string
  padName: string
  label: string
  sequence: boolean[]
  controls: Record<string, number>
  onToggleStep: (padName: string, stepIndex: number) => void
  onToggleEnabled: (padName: string) => void
  onControlChange: (padName: string, control: string, value: number) => void
}

const triggerKeyPress = (key: string) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true
  });
  window.dispatchEvent(event);
};

export const PadRow: FC<OptimizedPadRowProps> = memo(({
    playKey,
    padName,
    label,
    sequence,
    controls,
    onToggleStep,
    onToggleEnabled,
    onControlChange,
  }) => {
    const [enabled, setEnabled] = useState(true)

    return (
      <div className="flex gap-4 md:gap-2 justify-start items-center">
        <div className="flex flex-col md:flex-row items-center mb-2">
          <div className="flex flex-row gap-2 justify-start items-center">
            <div
              className="cursor-pointer"
              onClick={() => {
                onToggleEnabled(padName)
                setEnabled(!enabled)
              }}
            >
              {enabled && <Volume2 color="#d3855d" />}
              {!enabled && <VolumeOff color="#d3855d" />}
            </div>
            <PadControls
              padName={padName}
              controls={controls}
              onControlChange={onControlChange}
            />
          </div>
          <div
            className={`cursor-pointer select-none flex justify-center items-center h-[40px] text-center ${padColors[padName]} rounded-lg whitespace-nowrap w-[110px] md:w-[150px] text-[14px] md:text-[16] `}
            onClick={() => triggerKeyPress(playKey)}
          >
            {label}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:w-fit w-[180px] ">
          {sequence.map((active, idx) => {
            return (
              <div key={idx} data-step={idx} className="step-button-wrapper">
                <StepButton
                  stepIndex={idx}
                  isActive={active}
                  onClick={() => onToggleStep(padName, idx)}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  },
  (prev, next) => {
    if (prev.padName !== next.padName) return false
    if (prev.label !== next.label) return false

    if (prev.sequence.length !== next.sequence.length) return false
    for (let i = 0; i < prev.sequence.length; i++) {
      if (prev.sequence[i] !== next.sequence[i]) {
        return false
      }
    }

    const prevControlKeys = Object.keys(prev.controls)
    const nextControlKeys = Object.keys(next.controls)

    if (prevControlKeys.length !== nextControlKeys.length) return false

    for (const key of prevControlKeys) {
      if (prev.controls[key] !== next.controls[key]) {
        return false
      }
    }

    return true
  }
)

PadRow.displayName = 'PadRow'
