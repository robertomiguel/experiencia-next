'use server'
import axios from 'axios';

const getImage = async (url: string) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:${response.headers['content-type']};base64,${base64}`;
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    throw error;
  }
};

export const artGetSD15 = async ({prompt, faceData}: {prompt: string, faceData?: string}) => {

    const data: any = {
      job: {
        name: "sd-lcm",
        data: {
          model_version: "sd-1.5-realistic", // "sd-1.5-dreamshaper-8", // "sdxl-1.0-lcm-base", // "sd-1.5-realistic",
          lcm_lora_scale: 1, // 1,
          guidance_scale: 1.8, // 1.5,
          strength: 1,
          prompt,
          negativePrompt: "monochrome, lowres, bad anatomy, low quality, text, fat",
          prompts: [],
          seed: Date.now() % 1000000000,
          width: 1024,
          height: 1024,
          num_steps: 5,
          crop_init_image: true,
          init_image_strength: 0.8,
        },
        environment: null,
        browserToken: [...Array(20)].map(() => Math.random().toString(36)[2]).join(''),
      }
    };

    if (faceData) {
        data.job.data.init_image = faceData;
    }

    try {
        const res = await axios.post(process.env.PRIVATE_IMG_IA || '', data, {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
          }
        })
    
        return {
          url: await getImage(res.data.url),
        }
    } catch (error) {
        console.error('Error:', error)
        return {
            url: '',
        }
    }
}
