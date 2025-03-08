'use server'
import https from 'https';

export async function getBase64(url: string): Promise<string> {
  const fetchImage = (imageUrl: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      https.get(imageUrl, { 
        rejectUnauthorized: false,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Error al obtener la imagen: ${res.statusCode}`));
          return;
        }
        
        const data: any[] = [];
        
        res.on('data', (chunk) => {
          data.push(chunk);
        });
        
        res.on('end', () => {
          const buffer = Buffer.concat(data);
          resolve(buffer);
        });
        
      }).on('error', reject);
    });
  };

  try {
    const imageBuffer = await fetchImage(url);
    const base64 = imageBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
