'use server'
import axios from 'axios';
import { createHash } from 'crypto';

export const DeleteAction = async (publicId: string) => {

    const url = `https://api.cloudinary.com/v1_1/${process.env.IMAGE_CLOUD_NAME}/image/destroy`

    try {
        const timestamp = new Date().getTime().toString()
        const string = `public_id=${publicId}&timestamp=${timestamp}${process.env.IMAGE_CLOUD_API_SECRET}`

        const signature = createHash('sha1').update(string).digest('hex');
        const res = await axios.post(url, {
            api_key: process.env.IMAGE_CLOUD_API_KEY,
            public_id: publicId,
            timestamp,
            signature
        })

        return res.data?.result === 'ok'

    } catch (error) {
        const e = error as any
        if (e?.response?.data)
            console.log('error delete', e?.response?.data);
        else
            console.log('error delete', e);
        return false
    }
}
