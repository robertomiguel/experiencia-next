'use client'
import { FiEye, FiEyeOff, FiInfo, FiRefreshCcw, FiTrash } from "react-icons/fi"
import { useState } from "react"
import { useAppDispatch } from "@/store"
import { updateSettings } from "@/store/imagesSlice"
import { useRouter } from "next/navigation"
import { IImageList } from "@/types/image"

const iconStyle = 'text-gray-50 size-6'

export const ImageActions = ({ item }: { item: IImageList }) => {

    const [loading, setLoading] = useState(false)

    const dispatch = useAppDispatch()

    const router = useRouter()

    const handleDelete = async () => {
        setLoading(true)
        await fetch('/api/image/delete', {
            method: 'POST',
            body: JSON.stringify({ id: item.id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setLoading(false)
        location.reload();
    }

    const setSettings = () => {
        dispatch(updateSettings(item.params))
        router.push('/generate')
    }

    const hidden = async () => {
        setLoading(true)
        await fetch('/api/image/hidden', {
            method: 'POST',
            body: JSON.stringify({ id: item.id, hidden: !item.hidden }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setLoading(false)
        location.reload();
    }

    return (
        <div>
            <div className={`
                transition-all 
                ease-out text-transparent 
                hover:text-gray-50 absolute 
                bg-blue-800 w-9 h-9 
                overflow-hidden 
                hover:w-full hover:h-fit 
                sm:hover:w-fit max-w-screen-md sm:hover:h-fit 
                rounded-xl border-2 border-gray-50 
                p-1 shadow-lg `} >
                <div className="flex justify-between" >

                    <div className="w-fit p-0 m-0 h-fit">
                        <FiInfo className={iconStyle} />
                    </div>

                    <button disabled={loading} className="w-fit" onClick={setSettings} title="Load settings" >
                        <FiRefreshCcw className={iconStyle} />
                    </button>

                    <button disabled={loading} className="w-fit" onClick={hidden} title="Hidden" >
                        {item.hidden
                            ? <FiEye className={iconStyle} />
                            : <FiEyeOff className={iconStyle} />
                        }
                    </button>

                    <button disabled={loading} className="w-fit" onClick={handleDelete}>
                        <FiTrash className={iconStyle} />
                    </button>
                </div>
                <pre>
                    {JSON.stringify(item.params, null, 2)}
                </pre>
            </div>
        </div>
    )
}
