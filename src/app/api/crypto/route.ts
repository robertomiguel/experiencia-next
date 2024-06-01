import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const symbol = request.nextUrl.searchParams.get('symbol');

    const url = `${process.env.TV_INFO}/?symbol=${symbol}&locale=en`;

    const response = await fetch(url);
    const data = await response.text();

    return new NextResponse(data, {
        headers: {
            'Content-Type': 'text/html',
        }
    });
}