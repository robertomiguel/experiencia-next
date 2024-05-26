import axios from 'axios';

const key = process.env.REACT_APP_IMAGE_API_KEY;
const apiUrl = process.env.REACT_APP_IMAGE_API_GET_URL;
const auth = process.env.REACT_APP_IMAGE_API_AUTH || '';

export const waitSuccess = async (jobId: string) => {

    let jobResult = { status: 'pending', imageUrl: '' };

    while (jobResult.status !== 'succeeded' && jobResult.status !== 'failed') {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const response = await axios.get(`${apiUrl}/${jobId}`, {
                headers: {
                    [auth]: key
                }
            });

            jobResult = response.data;
        } catch (error) {
            console.error('Error getting job:', error);
            throw new Error('Error fetching image');
        }
    }

    return jobResult;
}