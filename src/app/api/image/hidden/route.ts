import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const body = await req.json()

    if (!body?.id) {
        return NextResponse.json({ error: 'No id' })
    }

    // update hidden field from images
    const res = await prisma.images.update({
        where: {
            id: body.id
        },
        data: {
            hidden: body?.hidden
        }
    })

    return NextResponse.json({ message: 'change' })
}