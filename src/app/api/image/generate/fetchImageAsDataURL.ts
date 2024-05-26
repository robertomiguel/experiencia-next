
export const fetchImageAsDataURL = async (imageUrl: string) => {
    try {
        const response = await fetch(imageUrl, { cache: 'force-cache' });
        const imageArrayBuffer = await response.arrayBuffer(); // Obtener el buffer de la imagen
        const base64 = Buffer.from(imageArrayBuffer).toString('base64'); // Convertir el buffer a Base64
        const dataUrl = `data:${response.headers.get('content-type')};base64,${base64}`; // Crear el Data URL

        return dataUrl;
    } catch (error) {
        console.error('Error fetching or converting image:', error);
        throw new Error('Error fetching image');
    }
};