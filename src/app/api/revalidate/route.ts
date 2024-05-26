import { revalidatePath } from "next/cache"

export async function POST(req: Request) {

    const body = await req.json()

    if (!body.secret || body.secret !== process.env.REVALIDATION_KEY) {
        return Response.json({ success: false, error: 'No route provided' }, { status: 400 })
    }

    revalidatePath('/images')

    return Response.json({ success: true })
}