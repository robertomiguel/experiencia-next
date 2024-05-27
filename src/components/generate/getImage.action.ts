'use server'
import prisma from '@/lib/prisma';
import axios from 'axios';
import { ImageGetRequest, ProcessRes } from '@/types/iaDraw';

export const GetImageAction = async ({ job }: { job: string }) => {

    const config = {
        method: 'get',
        url: `${process.env.PROXY_IMAGE_API_URL}/job/${job}`,
        headers: {
            'Accept': '*/*',
            'Origin': process.env.PROXY_IMAGE_APP_URL,
            'Referer': process.env.PROXY_IMAGE_APP_URL,
        }
    };

    try {
        const res = await axios(config)
        const processRes = res.data as ImageGetRequest;

        if (processRes.status === 'succeeded') {
            await prisma.jobs.update({
                where: {
                    job: job
                },
                data: {
                    isReady: true
                }
            })
        }
        return {
            isReady: processRes.status === 'succeeded',
            data: {
                seed: `${processRes.params.request.seed}`,
                prompt: processRes.params.request.prompt,
                model: processRes.params.options.sd_model_checkpoint,
                url: `${process.env.PROXY_IMAGE_HOST_URL}/${processRes.job}.png`,
            }
        } as ProcessRes
    } catch (error) {
        console.error(error)
        return {
            isReady: false,
            data: {}
        } as ProcessRes
    }
}