/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { pads, keyMap, SAMPLE_ROLAND_TR_808 } from "./setting";
import { SampleData, ControlsData } from "./types";
import { playSound } from "./playSound";
import { PadRow } from "./padRow";
import { Pause, Play } from "lucide-react";
import KnobControl from "./knobControl";

function applyControls(
  baseData: SampleData,
  userControls: ControlsData
): SampleData {
  const data = { ...baseData };
  data.controls = { ...baseData.controls, ...userControls };

  if (typeof userControls.decay === "number") {
    data.decay = userControls.decay;
  }
  return data;
}

export default function Sound() {
  const isPlayingRef = useRef(false);
  const [isPlayingUI, setIsPlayingUI] = useState(false);
  const currentStepRef = useRef(0);
  const tempoRef = useRef(120);
  const intervalRef = useRef<number | null>(null);
  const tempoChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initialPadStates = useMemo(
    () =>
      pads.reduce<
        Record<
          string,
          {
            enabled: boolean;
            sequence: boolean[];
            controls: Record<string, number>;
          }
        >
      >((acc, pad) => {
        const base = SAMPLE_ROLAND_TR_808[pad.name];
        acc[pad.name] = {
          enabled: true,
          sequence: Array(16).fill(false),
          controls: base?.controls ? { ...base.controls } : {},
        };
        return acc;
      }, {}),
    []
  );

  const padStatesRef = useRef(initialPadStates);
  const [padStatesForUI, setPadStatesForUI] = useState(initialPadStates);

  const updateCurrentStepVisual = useCallback(
    (newStep: number, oldStep: number) => {
      pads.forEach((pad, padIndex) => {
        const padData = padStatesRef.current[pad.name];
        if (!padData.enabled) return;

        const oldStepEl = document.querySelector(
          `[data-pad="${pad.name}"] [data-step="${oldStep}"]`
        );
        if (oldStepEl) {
          oldStepEl.classList.remove("current-step");
        }

        const newStepEl = document.querySelector(
          `[data-pad="${pad.name}"] [data-step="${newStep}"]`
        );
        if (newStepEl) {
          newStepEl.classList.add("current-step");
        }
      });
    },
    []
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const padName = keyMap[e.key];
    if (padName && SAMPLE_ROLAND_TR_808[padName]) {
      const userCtrls = padStatesRef.current[padName].controls;
      const data = applyControls(
        SAMPLE_ROLAND_TR_808[padName],
        userCtrls as any
      );
      playSound(data);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const togglePlay = useCallback(() => {
    isPlayingRef.current = !isPlayingRef.current;
    setIsPlayingUI(isPlayingRef.current);

    if (!isPlayingRef.current && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      currentStepRef.current = 0;

      document.querySelectorAll(".current-step").forEach((el) => {
        el.classList.remove("current-step");
      });
    }

    if (isPlayingRef.current) {
      startSequencer();
    }
  }, []);

  const processStep = useCallback((step: number) => {
    Object.keys(padStatesRef.current).forEach((padName) => {
      const padData = padStatesRef.current[padName];
      if (!padData.enabled) return;
      if (padData.sequence[step]) {
        const userCtrls = padData.controls;
        const data = applyControls(
          SAMPLE_ROLAND_TR_808[padName],
          userCtrls as any
        );
        playSound(data);
      }
    });
  }, []);

  const startSequencer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const stepTimeSec = 60 / tempoRef.current / 4;
    const ms = stepTimeSec * 1000;

    const id = window.setInterval(() => {
      const oldStep = currentStepRef.current;
      processStep(oldStep);

      const newStep = (oldStep + 1) % 16;
      currentStepRef.current = newStep;

      updateCurrentStepVisual(newStep, oldStep);
    }, ms);

    intervalRef.current = id;
  }, [processStep, updateCurrentStepVisual]);

  const toggleStep = useCallback((padName: string, stepIndex: number) => {
    const pad = padStatesRef.current[padName];
    const newSequence = [...pad.sequence];
    newSequence[stepIndex] = !newSequence[stepIndex];

    padStatesRef.current = {
      ...padStatesRef.current,
      [padName]: {
        ...pad,
        sequence: newSequence,
      },
    };

    const stepEl = document.querySelector(
      `[data-pad="${padName}"] [data-step="${stepIndex}"]`
    );

    if (stepEl) {
      const isActive = newSequence[stepIndex];
      stepEl.setAttribute("data-enabled", isActive ? "true" : "false");

      const group = Math.floor(stepIndex / 4);
      const groupColorsActived = [
        "rounded-full bg-[#e56655]",
        "rounded-full bg-[#fea75a]",
        "rounded-full bg-[#fdff82]",
        "rounded-full bg-[#fffffd]",
      ];
      const groupColors = [
        "rounded-full bg-transparent border-[#e56655]",
        "rounded-full bg-transparent border-[#fea75a]",
        "rounded-full bg-transparent border-[#fdff82]",
        "rounded-full bg-transparent border-[#fffffd]",
      ];

      if (isActive) {
        groupColors[group]
          .split(" ")
          .forEach((cls) => stepEl.classList.remove(cls));
        groupColorsActived[group]
          .split(" ")
          .forEach((cls) => stepEl.classList.add(cls));
      } else {
        groupColorsActived[group]
          .split(" ")
          .forEach((cls) => stepEl.classList.remove(cls));
        groupColors[group]
          .split(" ")
          .forEach((cls) => stepEl.classList.add(cls));
      }
    }
  }, []);

  const togglePadEnabled = useCallback((padName: string) => {
    const newEnabled = !padStatesRef.current[padName].enabled;

    padStatesRef.current = {
      ...padStatesRef.current,
      [padName]: {
        ...padStatesRef.current[padName],
        enabled: newEnabled,
      },
    };
  }, []);

  const handleControlChange = useCallback(
    (padName: string, ctrl: string, value: number) => {
      padStatesRef.current = {
        ...padStatesRef.current,
        [padName]: {
          ...padStatesRef.current[padName],
          controls: {
            ...padStatesRef.current[padName].controls,
            [ctrl]: value,
          },
        },
      };
    },
    []
  );

  const handleKnobControl = useCallback(
    (val: number) => {
      tempoRef.current = Number(val);

      if (!isPlayingRef.current) return;

      if (tempoChangeTimeoutRef.current) {
        clearTimeout(tempoChangeTimeoutRef.current);
      }

      tempoChangeTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current && intervalRef.current) {
          const currentStep = currentStepRef.current;

          clearInterval(intervalRef.current);
          startSequencer();

          const oldStep = (currentStep - 1 + 16) % 16;
          updateCurrentStepVisual(currentStep, oldStep);
        }

        tempoChangeTimeoutRef.current = null;
      }, 150);
    },
    [startSequencer, updateCurrentStepVisual]
  );

  const padRowProps = useMemo(() => {
    return pads.map(({ name, label, playKey }) => {
      const pd = padStatesForUI[name];
      return {
        playKey,
        padName: name,
        label,
        enabled: pd.enabled,
        sequence: pd.sequence,
        controls: pd.controls,
        onToggleStep: toggleStep,
        onToggleEnabled: togglePadEnabled,
        onControlChange: handleControlChange,
      };
    });
  }, [
    padStatesForUI,
    isPlayingUI,
    toggleStep,
    togglePadEnabled,
    handleControlChange,
  ]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (tempoChangeTimeoutRef.current) {
        clearTimeout(tempoChangeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#d3855d]">
        Roland TR 808 - Web Api Sound Sequencer - audioContext
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={togglePlay}
          className="bg-green-600 hover:bg-green-700 rounded w-[100px]"
        >
          {isPlayingUI ? <Pause /> : <Play />}
        </button>
      </div>

      <div className="flex justify-center items-center mb-6">
        <label className="mr-2 text-sm">TEMPO:</label>
        <KnobControl
          defaultValue={120}
          minValue={40}
          maxValue={300}
          onChange={handleKnobControl}
        />
      </div>

      <p className="text-center mb-6 text-[#d3855d] hidden md:block">
        Pulsa [1-9, 0, -] para disparar sonidos manualmente.
      </p>

      <div className="w-fit mx-auto flex flex-col md:gap-2 gap-8">
        {padRowProps.map((props) => (
          <div key={props.padName} data-pad={props.padName}>
            <PadRow {...props} key={props.padName} />
          </div>
        ))}
      </div>
    </div>
  )
}
