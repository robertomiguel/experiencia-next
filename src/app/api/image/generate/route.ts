import { NextResponse } from "next/server";
import axios from 'axios';
import { waitSuccess } from "./waitSuccess";
import { fetchImageAsDataURL } from "./fetchImageAsDataURL";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ImageParams } from "@/types/image";

const url = process.env.REACT_APP_IMAGE_API_URL;
const key = process.env.REACT_APP_IMAGE_API_KEY;
const auth = process.env.REACT_APP_IMAGE_API_AUTH || '';
const apiRevalidKey = process.env.REACT_APP_REVALIDATION_KEY;
const appUrl = process.env.REACT_APP_URL;

const generate = async (params: ImageParams) => {

    try {
        const response = await axios.post(`${url}`, params, {
            headers: {
                [auth]: key
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error image:`, error);
        throw new Error('Error fetching image');
    }

}

export async function POST(request: Request) {

    const body = (await request.json())

    if (!body) {
        return NextResponse.json({ error: 'No body' })
    }

    if (body.seed === -1) {
        body.seed = Number(new Date());
    }

    const proccess = await generate(body);

    if (!proccess?.job) {
        return NextResponse.json({ error: 'No job id', proccess })
    }

    const jobData = await waitSuccess(proccess.job);
    const image = await fetchImageAsDataURL(jobData.imageUrl);

    const p = body as Prisma.JsonArray;
    const imgData = await prisma.images.create({
        data: {
            jobId: proccess.job,
            image: image,
            params: p
        }
    })

    await fetch(`${appUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secret: apiRevalidKey }),
    })

    return NextResponse.json({ id: imgData.id })
}
