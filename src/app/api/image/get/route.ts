import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const i = params.get('i')
    const v = params.get('v')
    if (!i || !v) {
        return new NextResponse('', { status: 404 });
    }
    const imageUrl = `${process.env.IMAGE_CLOUD_GET}/v${v}/${i}.png`;

    try {
        const response = await fetch(imageUrl);
        if (!response.body) {
            return new NextResponse('Image not found or error fetching the image', { status: 404 });
        }

        // Usar el stream directo de la respuesta
        const { readable, writable } = new TransformStream();
        response.body.pipeTo(writable);

        // Declarar el objeto de encabezados con tipos explícitos
        const headers: Record<string, string> = {
            'Content-Type': 'image/png', // Tipo MIME de la imagen
        };

        // Obtener 'Content-Length' y añadirlo solo si no es null
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
            headers['Content-Length'] = contentLength;
        }

        // Crear una respuesta de Next.js que envía el stream de la imagen
        const nextResponse = new NextResponse(readable, {
            headers: headers
        });

        return nextResponse;
    } catch {
        return new NextResponse('Failed to fetch image', { status: 500 });
    }
}
