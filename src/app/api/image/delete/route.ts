import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const body = await req.json()

    if (!body?.id) {
        return NextResponse.json({ error: 'No id' })
    }

    await prisma.images.delete({
        where: {
            id: body.id
        }
    })

    return NextResponse.json({ message: 'Image deleted' })
}