import { useCallback } from "react";
import { Slider } from "./slider";
import { SliderDefinition, StyleState } from "./sliderDefinitions";


interface Props {
  title: string;
  sliders: Array<SliderDefinition>;
  section: string;
  styleState: StyleState;
  updateStyle: ( key: any, value: any ) => void;
  activeSlider: string | null;
  setActiveSlider: (id: string | null) => void;
}

export const RenderSection = ({
  title,
  sliders,
  section,
  styleState,
  updateStyle,
  activeSlider,
  setActiveSlider,
}: Props) => {
  const updateOpacity = useCallback(
    (opacity: number) => {
      const rgbaMatch = styleState.shadowColor.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
      );

      if (rgbaMatch) {
        const [, r, g, b] = rgbaMatch;
        updateStyle("shadowColor", `rgba(${r}, ${g}, ${b}, ${opacity / 100})`);
      } else {
        const hexMatch = styleState.shadowColor.match(
          /#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/
        );
        if (hexMatch) {
          const [, r, g, b] = hexMatch;
          const rDec = parseInt(r, 16);
          const gDec = parseInt(g, 16);
          const bDec = parseInt(b, 16);
          updateStyle(
            "shadowColor",
            `rgba(${rDec}, ${gDec}, ${bDec}, ${opacity / 100})`
          );
        } else {
          // Por defecto, usamos negro con la opacidad proporcionada
          updateStyle("shadowColor", `rgba(0, 0, 0, ${opacity / 100})`);
        }
      }
    },
    [styleState.shadowColor, updateStyle]
  );

  const getOpacity = useCallback(() => {
    const rgbaMatch = styleState.shadowColor.match(/rgba\(.*,\s*([0-9.]+)\)/);
    if (rgbaMatch) {
      return Math.round(parseFloat(rgbaMatch[1]) * 100);
    }

    if (styleState.shadowColor.startsWith("#")) {
      return 100;
    }

    return 60;
  }, [styleState.shadowColor]);

  return (
    <div className="text-blue-950 mb-4 p-3 rounded">
      <h4 className="font-medium mb-3">{title}</h4>

      {section === "shadow" && (
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="shadowEnabled"
            checked={styleState.shadowEnabled}
            onChange={(e) => updateStyle("shadowEnabled", e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="shadowEnabled" className="font-medium cursor-pointer">
            Activar sombra
          </label>
        </div>
      )}

      {section === "shadow" && styleState.shadowEnabled && (
        <div
          className={`mb-3 ${activeSlider && activeSlider !== "shadow-color" ? "opacity-20" : ""}`}
        >
          <label className="block mb-1 font-medium">Color:</label>
          <div className="flex items-center">
            <input
              type="color"
              value={styleState.shadowColor.replace(/[^#\w]/g, "#")}
              onChange={(e) => updateStyle("shadowColor", e.target.value)}
              onMouseDown={() => setActiveSlider("shadow-color")}
              onMouseUp={() => setActiveSlider(null)}
              className="p-1 w-10 h-8 border rounded"
            />
          </div>
        </div>
      )}

      {section === "shadow" && styleState.shadowEnabled && (
        <Slider
          label="Opacidad"
          value={getOpacity()}
          min={0}
          max={100}
          suffix="%"
          onChange={updateOpacity}
          activeSlider={activeSlider}
          setActiveSlider={setActiveSlider}
          id="shadow-opacity"
        />
      )}

      {sliders.map(
        (slider) =>
          (section !== "shadow" || styleState.shadowEnabled) && (
            <Slider
              key={slider.id}
              label={slider.label}
              value={Number(styleState[slider.id])}
              min={slider.min}
              max={slider.max}
              suffix={slider.suffix}
              onChange={(value) => updateStyle(slider.id, value)}
              activeSlider={activeSlider}
              setActiveSlider={setActiveSlider}
              id={`${section}-${slider.id}`}
            />
          )
      )}
    </div>
  );
};
