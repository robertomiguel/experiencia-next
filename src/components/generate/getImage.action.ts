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

        let url = ''

        try {
            if (processRes.status === 'succeeded') {

                const cloud_url = process.env.IMAGE_CLOUD_UPLOAD as string

                const formData = new FormData();
                formData.append("api_key", process.env.IMAGE_CLOUD_API_KEY as string);
                formData.append("file", `${process.env.PROXY_IMAGE_HOST_URL}/${processRes.job}.png`);
                formData.append("public_id", job)
                formData.append("timestamp", new Date().getTime().toString())
                formData.append("upload_preset", 'preset1')
                formData.append("folder", process.env.IMAGE_CLOUD_FOLDER || 'iadraw/temp')

                const result = await axios.post(cloud_url, formData)

                url = result.data.secure_url || result.data.url || url

                const urlParams = url.split('/upload/v')[1].split('/iadraw/');
                const v = urlParams[0];
                const i = urlParams[1].slice(0, -4);

                url = `/api/image/get?i=iadraw/${i}&v=${v}`

                await prisma.jobs.update({
                    where: {
                        job
                    },
                    data: {
                        isReady: true,
                        secureUrl: result.data.secure_url.toString() || '',
                        url: result.data.url.toString() || '',
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }
        return {
            isReady: processRes.status === 'succeeded',
            data: {
                seed: `${processRes.params.request.seed}`,
                prompt: processRes.params.request.prompt,
                url,
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