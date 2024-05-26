import prisma from "@/lib/prisma";
import Link from "next/link"
import { PaginatorNumber } from "./PaginatorNumber";

export const Paginator = async ({ page = 1, hidden = false }: { page: number, hidden?: boolean }) => {
    const where = {
        hidden,
        deletedAt: null,
    }
    const count = await prisma.images.count({ where });
    const totalPage = Math.ceil(count / 5)

    return (
        <div className="flex flex-row gap-4 w-full p-3" >
            Total {count}
            {[...Array(totalPage)].map((_, i) => {
                'use client'
                const p = i + 1
                return (
                    <Link key={p} href={`${hidden ? '/private' : '/images'}/${p}`}>
                        <PaginatorNumber p={p} />
                    </Link>
                )
            }
            )}
        </div>
    )
}