import axios from 'axios';
import FormData from 'form-data';

export async function translate(q, k) {
    try {
        const url = process.env.TRANSLATE_URL;

        const formData = new FormData();
        formData.append('q', q);
        formData.append('source', 'es');
        formData.append('target', 'en');
        formData.append('format', 'text');
        formData.append('api_key', '');
        formData.append('secret', k);

        const response = await axios.post(url, formData, {
            headers: {
                'accept': '*/*',
                'content-type': `multipart/form-data; boundary=${formData._boundary}`,
                'origin': process.env.TRASLATE_ORIGIN,
            }
        });

        return response.data;
    } catch (error) {
        return error;
    }
}
