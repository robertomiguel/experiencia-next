import { ImageParams } from "@/types/image";
import axios from "axios";

export const generateImage = async (params: ImageParams) => {

    try {
        await axios.post("/api/image/generate", params);

    } catch (e) {
        console.error('Error generating image', e);
        throw new Error('Error generating image');
    }
}