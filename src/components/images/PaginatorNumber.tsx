'use client'

import { useParams } from "next/navigation"

export const PaginatorNumber = ({ p }: { p: number }) => {

    const param = useParams()
    const page = parseInt(param.p as string)

    return (
        <span className={
            p === page
                ? 'bg-blue-200 text-blue-950 w-1 h-1 p-1 rounded-full'
                : ''} >
            {p}
        </span>
    )
}
