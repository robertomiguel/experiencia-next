
export const fetchKeyData = async () => {
    const urlKey = process.env.TRANSLATE_GET_KET;
    if (!urlKey) {
        throw new Error('No URL key provided.');
    }
    try {
        const response = await fetch(urlKey, {
            cache: 'no-cache'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const text = await response.text();

        const match = text.match(/apiSecret: "([^"]+)"/);
        if (match) {
            const apiSecret = match[1];
            return apiSecret;
        } else {
            console.log('No match found translation key');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};