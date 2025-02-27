
export interface StyleState {
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  exposure: number;
  contrast: number;
  saturation: number;
  shadows: number;
  highlights: number;
  whites: number;
  blacks: number;
  clarity: number;
}


export interface SliderDefinition {
  id: keyof StyleState;
  label: string;
  min: number;
  max: number;
  suffix: string;
}


export const sliderDefinitions: {
    shadow: SliderDefinition[];
    tones: SliderDefinition[];
  } = {
    shadow: [
      {
        id: "shadowBlur" as keyof StyleState,
        label: "Desenfoque",
        min: 0,
        max: 50,
        suffix: "px",
      },
      {
        id: "shadowOffsetX" as keyof StyleState,
        label: "Desplazamiento X",
        min: -50,
        max: 50,
        suffix: "px",
      },
      {
        id: "shadowOffsetY" as keyof StyleState,
        label: "Desplazamiento Y",
        min: -50,
        max: 50,
        suffix: "px",
      },
    ],
    tones: [
      {
        id: "exposure" as keyof StyleState,
        label: "Exposición",
        min: 0,
        max: 200,
        suffix: "%",
      },
      {
        id: "contrast" as keyof StyleState,
        label: "Contraste",
        min: 0,
        max: 200,
        suffix: "%",
      },
      {
        id: "saturation" as keyof StyleState,
        label: "Saturación",
        min: 0,
        max: 200,
        suffix: "%",
      },
      {
        id: "shadows" as keyof StyleState,
        label: "Sombras",
        min: -100,
        max: 100,
        suffix: "",
      },
      {
        id: "highlights" as keyof StyleState,
        label: "Altas luces",
        min: -100,
        max: 100,
        suffix: "",
      },
      {
        id: "whites" as keyof StyleState,
        label: "Blancos",
        min: -100,
        max: 100,
        suffix: "",
      },
      {
        id: "blacks" as keyof StyleState,
        label: "Negros",
        min: -100,
        max: 100,
        suffix: "",
      },
      {
        id: "clarity" as keyof StyleState,
        label: "Claridad",
        min: -100,
        max: 100,
        suffix: "",
      },
    ],
  };