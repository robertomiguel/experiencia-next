import { FormField } from "@/types/common";

const models = [
    "absolutereality_v181.safetensors [3d9d4d2b]",
    "childrensStories_v1SemiReal.safetensors [a1c56dbb]",
    "epicphotogasm_xPlusPlus.safetensors [1a8f6d35]",
    "indigoFurryMix_v75Hybrid.safetensors [91208cbb]",
    "majicmixRealistic_v4.safetensors [29d0de58]",
];

const aspectRatio = ["square",
    "portrait",
    "landscape"];

const samplerList = [
    "Euler",
    "Euler a",
    "Heun",
    "DPM++ 2M Karras",
    "DPM++ SDE Karras",
    "DDIM",
];

export const formFields: FormField[] = [
    {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        className: 'w-full sm:w-1/2 p-2',
    },
    {
        name: "negative_prompt",
        label: "Negative Prompt",
        type: "textarea",
        className: 'w-full sm:w-1/2 p-2',
    },

    {
        name: "model",
        label: "Model",
        type: "select",
        options: models,
        className: 'w-full p-2',
    },

    {
        name: "steps",
        label: "Steps",
        type: "input",
        componentType: "number",
        className: 'w-1/2 sm:w-1/6 p-2',
    },
    {
        name: "cfg_scale",
        label: "CFG Scale",
        type: "input",
        componentType: "number",
        className: 'w-1/2 sm:w-1/6 p-2',
    },
    {
        name: "seed",
        label: "Seed",
        type: "input",
        componentType: "number",
        className: 'w-1/2 sm:w-1/4 p-2',
    },
    {
        name: "upscale",
        label: "Upscale",
        type: "checkbox",
        className: 'w-1/2 sm:w-1/6 flex flex-col gap-3 justify-start items-center text-center p-2',
    },
    {
        name: "aspect_ratio",
        label: "Aspect Ratio",
        type: "select",
        options: aspectRatio,
        className: 'w-full sm:w-1/4 p-2',
    },

    {
        name: "width",
        label: "Width",
        type: "input",
        componentType: "number",
        className: 'w-1/2 sm:w-1/3 p-2',
    },
    {
        name: "height",
        label: "Height",
        type: "input",
        componentType: "number",
        className: 'w-1/2 sm:w-1/3 p-2',
    },
    {
        name: "sampler",
        label: "Sampler",
        type: "select",
        options: samplerList,
        className: 'w-full sm:w-1/3 p-2'
    }
];
