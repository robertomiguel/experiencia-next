'use server'
import prisma from '@/lib/prisma';
import { ImageGenerateRequest } from '@/types/iaDraw';
import axios from 'axios';

const model_index: { [index: number]: string } = {
    1: "3Guofeng3_v34.safetensors [50f420de]",
    2: "absolutereality_V16.safetensors [37db0fc3]",
    3: "absolutereality_v181.safetensors [3d9d4d2b]",
    4: "amIReal_V41.safetensors [0a8a2e61]",
    5: "analog-diffusion-1.0.ckpt [9ca13f02]",
    6: "anythingv3_0-pruned.ckpt [2700c435]",
    7: "anything-v4.5-pruned.ckpt [65745d25]",
    8: "anythingV5_PrtRE.safetensors [893e49b9]",
    9: "AOM3A3_orangemixs.safetensors [9600da17]",
    10: "blazing_drive_v10g.safetensors [ca1c1eab]",
    11: "breakdomain_I2428.safetensors [43cc7d2f]",
    12: "breakdomain_M2150.safetensors [15f7afca]",
    13: "cetusMix_Version35.safetensors [de2f2560]",
    14: "childrensStories_v13D.safetensors [9dfaabcb]",
    15: "childrensStories_v1SemiReal.safetensors [a1c56dbb]",
    16: "childrensStories_v1ToonAnime.safetensors [2ec7b88b]",
    17: "Counterfeit_v30.safetensors [9e2a8f19]",
    18: "cuteyukimixAdorable_midchapter3.safetensors [04bdffe6]",
    19: "cyberrealistic_v33.safetensors [82b0d085]",
    20: "dalcefo_v4.safetensors [425952fe]",
    21: "deliberate_v2.safetensors [10ec4b29]",
    22: "deliberate_v3.safetensors [afd9d2d4]",
    23: "dreamlike-anime-1.0.safetensors [4520e090]",
    24: "dreamlike-diffusion-1.0.safetensors [5c9fd6e0]",
    25: "dreamlike-photoreal-2.0.safetensors [fdcf65e7]",
    26: "dreamshaper_6BakedVae.safetensors [114c8abb]",
    27: "dreamshaper_7.safetensors [5cf5ae06]",
    28: "dreamshaper_8.safetensors [9d40847d]",
    29: "edgeOfRealism_eorV20.safetensors [3ed5de15]",
    30: "EimisAnimeDiffusion_V1.ckpt [4f828a15]",
    31: "elldreths-vivid-mix.safetensors [342d9d26]",
    32: "epicphotogasm_xPlusPlus.safetensors [1a8f6d35]",
    33: "epicrealism_naturalSinRC1VAE.safetensors [90a4c676]",
    34: "epicrealism_pureEvolutionV3.safetensors [42c8440c]",
    35: "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]",
    36: "indigoFurryMix_v75Hybrid.safetensors [91208cbb]",
    37: "juggernaut_aftermath.safetensors [5e20c455]",
    38: "lofi_v4.safetensors [ccc204d6]",
    39: "lyriel_v16.safetensors [68fceea2]",
    40: "majicmixRealistic_v4.safetensors [29d0de58]",
    41: "mechamix_v10.safetensors [ee685731]",
    42: "meinamix_meinaV9.safetensors [2ec66ab0]",
    43: "meinamix_meinaV11.safetensors [b56ce717]",
    44: "neverendingDream_v122.safetensors [f964ceeb]",
    45: "openjourney_V4.ckpt [ca2f377f]",
    46: "pastelMixStylizedAnime_pruned_fp16.safetensors [793a26e8]",
    47: "portraitplus_V1.0.safetensors [1400e684]",
    48: "protogenx34.safetensors [5896f8d5]",
    49: "Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]",
    50: "Realistic_Vision_V2.0.safetensors [79587710]",
    51: "Realistic_Vision_V4.0.safetensors [29a7afaa]",
    52: "Realistic_Vision_V5.0.safetensors [614d1063]",
    53: "Realistic_Vision_V5.1.safetensors [a0f13c83]",
    54: "redshift_diffusion-V10.safetensors [1400e684]",
    55: "revAnimated_v122.safetensors [3f4fefd9]",
    56: "rundiffusionFX25D_v10.safetensors [cd12b0ee]",
    57: "rundiffusionFX_v10.safetensors [cd4e694d]",
    58: "sdv1_4.ckpt [7460a6fa]",
    59: "v1-5-pruned-emaonly.safetensors [d7049739]",
    60: "v1-5-inpainting.safetensors [21c7ab71]",
    61: "shoninsBeautiful_v10.safetensors [25d8c546]",
    62: "theallys-mix-ii-churned.safetensors [5d9225a4]",
    63: "timeless-1.0.ckpt [7c4971d4]",
    64: "toonyou_beta6.safetensors [980f6b15]"
}

interface GenerateProps {
    prompt: string;
    model: number;
    seed?: number;
}

export const GenerateAction = async ({ prompt, model, seed }: GenerateProps) => {

    const modelValue = model_index[model] || model_index[3];

    const seedValue = isNaN(Number(seed)) ? -1 : seed || Number(new Date());

    if (!prompt.trim()) return { job: '', seed: 0 };
    const config = {
        method: 'get',
        url: `${process.env.PROXY_IMAGE_API_URL}/generate`,
        params: {
            new: false,
            prompt: prompt,
            model: modelValue,
            steps: 20,
            cfg: 7,
            seed: seedValue,
            sampler: 'DPM++ 2M Karras',
            aspect_ratio: 'portrait',
        },
        headers: {
            'Accept': '*/*',
            'Origin': process.env.PROXY_IMAGE_APP_URL,
            'Referer': process.env.PROXY_IMAGE_APP_URL,
        }
    };
    try {
        const res = await axios(config)
        const generateRes = res.data as ImageGenerateRequest;
        await prisma.jobs.create({
            data: {
                job: generateRes.job,
                prompt: generateRes.params.request.prompt,
                seed: `${generateRes.params.request.seed}`,
                model: generateRes.params.options.sd_model_checkpoint,
                isReady: generateRes.status === 'succeeded',
                params: generateRes.params as any,
            }
        });
        return {
            job: generateRes.job,
            seed: generateRes.params.request.seed
        };
    } catch (error) {
        console.log(error);
        return { job: '', seed: 0 };
    }

}