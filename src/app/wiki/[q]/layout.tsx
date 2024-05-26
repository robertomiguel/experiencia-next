import WikiForm from "@/components/wikipedia/WikiForm";

interface Props {
    children: any;
    params: { q: string };
}

export default function Layout({ children, params }: Props) {
    return (
        <section>
            <WikiForm q={params.q || ''} />
            {children}
        </section>
    );
}