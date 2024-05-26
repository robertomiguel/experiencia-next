'use server'
import prisma from "@/lib/prisma";
import { WikiData, WikiDataList } from "@/types/wikipedia";
import { redirect } from "next/navigation";

const WIKI_API_URL = process.env.WIKI_API_URL

const getWikiData = async (text: string) => {
    try {
        const url = `${WIKI_API_URL}?q=${text}&limit=${100}`
        const { pages } = await fetch(url).then(res => res.json())
        return (pages as WikiData[]).filter((item: WikiData) => item.thumbnail?.url)
    } catch (error) {
        console.error(error)
        throw new Error('Error fetching wiki data')
    }
}

export const wikiAction = async (search: string) => {

    if (!search) {
        redirect(`/wiki`)
    }

    // buscar en db si existe el termino search
    const wikiSearch = await prisma.wikiSearch.findFirst({
        where: {
            text: search
        },
        select: {
            id: true,
        }
    })

    // si no existe el termino search en db lo agrego
    if (!wikiSearch?.id) {
        const newSearch = await prisma.wikiSearch.create({
            data: {
                text: search
            }
        })
    }

    // busco en la api los datos
    const newList = await getWikiData(search)
    // guardo los datos en la lista para la vista
    const list: WikiDataList[] = newList.map((item: WikiData) => ({
        id: item.id,
        title: item.title,
        description: item.excerpt,
        imageUrl: item.thumbnail.url,
    }))

    return list
}