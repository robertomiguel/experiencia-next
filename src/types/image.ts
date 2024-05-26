
export interface ImageParams {
    prompt: string;
    model: string;
    negative_prompt: string;
    // style_preset: string;
    steps: number;
    cfg_scale: number;
    seed: number;
    upscale: boolean;
    sampler: string;
    aspect_ratio: 'landscape' | 'portrait' | 'square';
    width: number;
    height: number;
}

export interface IImageList {
    id: string
    image: string
    params: any
    hidden: boolean
}