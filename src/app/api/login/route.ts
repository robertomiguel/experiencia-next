import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { encode } from 'next-auth/jwt';

export async function POST(request: NextRequest) {

    const body = await request.json()

    // password send by user
    const userPassword = body?.password || ''

    // password valid
    const validPassword = process.env.PASSWORD

    const JWT_SECRET = process.env.JWT_SECRET || ''

    if (userPassword === validPassword) {

        const token = await encode({
            token: {
                password: validPassword,
                exp: Math.floor(Date.now() / 1000) + (60), // 1 minute
                role: 'admin',
            },
            secret: JWT_SECRET
        })

        return NextResponse.json({ token })
    }


    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
}
