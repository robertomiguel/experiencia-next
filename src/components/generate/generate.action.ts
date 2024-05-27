'use server'
import prisma from '@/lib/prisma';
import { ImageGenerateRequest } from '@/types/iaDraw';
import axios from 'axios';

export const GenerateAction = async ({ prompt }: { prompt: string }) => {
    if (!prompt.trim()) return { job: '', seed: 0 };
    const config = {
        method: 'get',
        url: `${process.env.PROXY_IMAGE_API_URL}/generate`,
        params: {
            new: false,
            prompt: prompt,
            model: 'absolutereality_v181.safetensors [3d9d4d2b]',
            steps: 20,
            cfg: 7,
            seed: Number(new Date()),
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