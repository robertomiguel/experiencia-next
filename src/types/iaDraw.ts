
interface ImageRequest {
    prompt: string;
    cfg_scale: number;
    steps: number;
    negative_prompt: string;
    seed: number;
    sampler_name: string;
    width: number;
    height: number;
}

export interface ImageGetRequest {
    job: string;
    params: {
        type: string;
        options: {
            sd_model_checkpoint: string;
        };
        request: ImageRequest;
    };
    status: string;
}

export interface ImageGenerateRequest {
    job: string;
    status: string;
    params: {
        type: string;
        options: {
            sd_model_checkpoint: string;
        };
        request: ImageRequest;
    };
}

export interface GenerateRes {
    job: string;
    seed: number;
}

export interface ProcessRes {
    isReady: boolean
    data: ImageItem
}

export interface ImageItem {
    url: string
    seed: string
    prompt: string
    model: number
}

interface Option {
    label: any
    value: any
}

export interface ImageSchema {
    dancerStyles: Option[]
    backgrounds: Option[]
    hairColors: Option[]
    hairStyles: Option[]
    hairLengths: Option[]
    eyeColors: Option[]
    genderList: Option[]
    ethnicGroups: Option[]
    modelList: Option[]
}
