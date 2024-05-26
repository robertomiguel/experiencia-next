import prisma from "@/lib/prisma"
import { ImageActions } from "./ImageActions";
import { ImageBox } from "./ImageBox";
import { IImageList } from "@/types/image";

export const ImageList = async ({ searchParams, hidden = false }: { searchParams: any, hidden?: boolean }) => {

    const select = {
        id: true,
        image: true,
        params: true,
        hidden: true,
    }
    const where = {
        hidden,
        deletedAt: null,
    }

    const count = await prisma.images.count({ where });
    if (!count || count === 0) {
        return (
            <div className="m-auto w-full">
                <h1 className="text-center text-2xl">No images found</h1>
            </div>
        )
    }
    const totalPage = Math.ceil(count / 5)
    const pageParam = (isNaN(searchParams?.p) ? 1 : parseInt(searchParams?.p)) || 1
    const page = pageParam === 0 ? 1 : pageParam > totalPage ? totalPage : pageParam
    const skip = 5 * (page - 1)
    const list: IImageList[] = await prisma.images.findMany({
        select,
        where,
        orderBy: {
            createdAt: 'desc'
        },
        skip,
        take: 5, // limit
    });

    return (
        <div className="flex flex-row flex-wrap gap-3 m-auto w-full" >
            {list.map((item) => {
                return (
                    <div key={item.id} className="m-auto w-full sm:w-fit">
                        <ImageActions item={item} />
                        <ImageBox image={item.image} />
                    </div>
                )
            })}
        </div>
    );
}