
import { ImageParams } from '@/types/image';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ImageItem {
    id: string;
    image?: any;
    params?: any;
}

export interface initialState {
    list: ImageItem[];
    settings: Partial<ImageParams>;
}

const defaultSettings: ImageParams = {
    "prompt": "mountain sunset with lake",
    "model": "absolutereality_v181.safetensors [3d9d4d2b]",
    "negative_prompt": "",
    "steps": 20,
    "cfg_scale": 7,
    "seed": -1,
    "upscale": false,
    "sampler": "DPM++ 2M Karras",
    "aspect_ratio": "portrait",
    "width": 819,
    "height": 1024
}

const imagesSlice = createSlice({
    name: 'images',
    initialState: <initialState>{
        list: [],
        settings: defaultSettings,
    },
    reducers: {
        updateSettings(state, action: PayloadAction<Partial<ImageParams>>) {
            state.settings = { ...state.settings, ...action.payload };
        },
        loadImagesList(state, action) {
            state.list = action.payload.list;
        },
        loadImagesSettings(state, action) {
            state.settings = action.payload.settings;
        },
    },
});

export const {
    updateSettings,
    loadImagesList,
    loadImagesSettings,
} = imagesSlice.actions;

export default imagesSlice.reducer;