import { ImageList } from "@/components/images/ImageList";


export default function Image({ params }: { params: any }) {
    return (<div>
        <ImageList searchParams={params} />
    </div>);
}