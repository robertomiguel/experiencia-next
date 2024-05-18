'use server'
export default async function getWikiData() {
    const text = 'madonna'
    try {
        const url = `https://es.wikipedia.org/w/rest.php/v1/search/page?q=${text}&limit=${10}`
        const response = await fetch(url)
        const { pages } = await response.json()
        console.log(pages);
        return pages

    } catch (error) {
        console.log(error);
        return []
    }
}
