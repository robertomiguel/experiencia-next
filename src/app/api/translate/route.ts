import { translate } from './translate.js'
import { fetchKeyData } from './fetchKeyData.js'

const toEng = async (q: string, k: string) => {
    try {
        const response = await translate(q, k);
        return response;
    } catch (error) {
        throw new Error('Error fetching translation');
    }
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const body = await request.json()

    const q = body?.q

    const k = await fetchKeyData();

    if (!q) {
        return NextResponse.json({ text: 'No text to translate' })
    }

    if (!k) {
        return NextResponse.json({ text: 'No key to translate' })
    }

    const text = await toEng(q, k);

    return NextResponse.json({ ...text })
}
