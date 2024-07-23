'use server'
import axios from 'axios';

export const UpScale = async (image: string) => {
  const params = {
    job: {
      name: "upscale",
      data: {
        image: {
          type: "url",
          url: image
        }
      }
    },
    environment: null,
    browserToken: [...Array(20)].map(() => Math.random().toString(36)[2]).join('')
  };

  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
  };

  try {
    const response = await axios.post(process.env.PRIVATE_IMG_IA || '', params, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
