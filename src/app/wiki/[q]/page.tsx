import WikiList from "@/components/wikipedia/list/WikiList";
import { wikiAction } from "@/components/wikipedia/wiki.action";

export default async function Wiki({ params }: { params: { q: string } }) {

    const list = await wikiAction(params?.q || '')

    return (
        list.length > 0 ? <WikiList list={list} /> : <h4>No hay resultados</h4>
    );
}