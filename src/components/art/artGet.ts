'use server'
import axios from 'axios';

export const artGet = async ({prompt, faceData}: {prompt: string, faceData?: string}) => {

const url = process.env.PRIVATE_IMG_IA || ''

const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
};

const seed = Date.now() % 1000000000;

const data: any = {
    job: {
      name: "multi-ipa-light",
      data: {
        seed,
        prompt,
        guidance_scale: 1,
        width: 1024,
        height: 1024,
        num_inference_steps: 4,
        init_image: null,
        init_image_strength: 0.2,
        scribble_guidance_scale: 0,
        scribble_guidance_image: null,
        model_name: "sdxl-lightning",
        return_binary: true,
        image_format: "jpeg",
        ipa_data: [],
        negative_prompt: "bad skin tone, bad anatomy, bad lighting, bad composition, bad perspective, bad color, bad contrast, bad focus, bad framing, bad exposure, bad saturation, bad shadows, bad highlights, bad texture, bad details, bad realism, bad quality, bad resolution, bad noise, bad blur, bad grain, bad artifacts, bad distortion",
        do_upres: false,
        do_upscale: false
      },
      alias: "composer-image"
    },
    environment: null,
    browserToken: [...Array(20)].map(() => Math.random().toString(36)[2]).join(''),
  };

/* const data: any = {
    job: {
        name: "sd-lightning",
        data: {
            seed,
            prompt,
            ip_adapter_scales: [0, 0.8, 0],
            guidance_scale: 1,
            width: 960,
            height: 960,
            num_inference_steps: 4,
            do_upres: false,
            do_upscale: false,
            init_image: null,
            init_image_strength: 0.2,
            chaosScales: {
                face: 0.75,
                style: 0.75,
                content: 0.75
            },
            return_binary: true,
            negative_prompt: "bad skin tone, bad anatomy, bad lighting, bad composition, bad perspective, bad color, bad contrast, bad focus, bad framing, bad exposure, bad saturation, bad shadows, bad highlights, bad texture, bad details, bad realism, bad quality, bad resolution, bad noise, bad blur, bad grain, bad artifacts, bad distortion",
            enhance: false
        },
        alias: "composer-image"
    },
    environment: null,
    browserToken: [...Array(20)].map(() => Math.random().toString(36)[2]).join(''),
}; */

if (faceData) {
    data.job.data.reference_images = [
        {
            data: faceData,
            weight: 1,
            referenceType: "face"
        },
    ]
}

try {
    const response = await axios.post(url, data, { headers: headers, responseType: 'arraybuffer' });
    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
    return { image: base64Image, seed, prompt };
  } catch (error) {
    console.error('Error fetching image:', error);
    return { image: '' };
  }

}
