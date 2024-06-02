'use server'
import prisma from '@/lib/prisma';
import { ImageGenerateRequest } from '@/types/iaDraw';
import axios from 'axios';
interface GenerateProps {
    prompt: string;
    model: number;
    seed?: number;
}

export const GenerateAction = async ({ prompt, model, seed }: GenerateProps) => {

    const modelName = await prisma.modelSDV.findFirst({
        where: {
            id: model || 3
        },
        select: {
            name: true
        }
    });

    if (!modelName) return { job: '', seed: 0 };

    const modelValue = modelName?.name

    const seedValue = isNaN(Number(seed)) ? -1 : seed || Number(new Date());

    if (!prompt.trim()) return { job: '', seed: 0 };
    const config = {
        method: 'get',
        url: `${process.env.PROXY_IMAGE_API_URL}/generate`,
        params: {
            new: false,
            prompt,
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