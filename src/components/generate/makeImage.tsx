'use client'

import { useEffect, useState } from "react"
import { GenerateAction } from "./generate.action"
import { GetImageAction } from "./getImage.action"
import { FormSearchInput } from "../common/FormSearchInput";
import Image from "next/image";
import { A } from "../common/A";
import { FiDownload, FiRefreshCcw, FiTrash } from "react-icons/fi";
import style from './makeImage.module.css'
import { Spinner } from "../common/Spinner";
import { GenerateRes, ImageItem, ProcessRes } from "@/types/iaDraw";

export const MakeImage = () => {

    const [list, setList] = useState<ImageItem[]>([])
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const handleGenerate = async (prompt: string) => {
        setIsProcessing(true)
        const res: GenerateRes = await GenerateAction({ prompt })
        if (res.job) await handleProcess(res.job)
        setIsProcessing(false)
    }

    const handleProcess = async (job: string) => {
        // bucle hasta que isReady sea true o luego de 10 intentos, delay de 1.5 segundos en cada intento
        let count = 0
        let finished = false
        while (!finished && count < 10) {
            await new Promise(resolve => setTimeout(resolve, 1500))
            count++
            const res: ProcessRes = await GetImageAction({ job })
            if (res.isReady) {
                const newList = [res.data, ...list]
                setList(newList)
                localStorage.setItem('drawList', JSON.stringify(newList))
                finished = true
                break
            }
        }
    }

    useEffect(() => {
        const localList = localStorage.getItem('drawList')
        const initialList = localList ? JSON.parse(localList) : []
        setList(initialList)
    }, [])

    const handleDelete = (index: number) => {
        const newList = list.filter((_, i) => i !== index)
        setList(newList)
        localStorage.setItem('drawList', JSON.stringify(newList))
    }

    const handleRebuild = async (index: number) => {
        await handleGenerate(list[index].prompt)
    }

    return (
        <div>
            <FormSearchInput
                onSubmit={handleGenerate}
                disabled={isProcessing}
                placeholder="Type a prompt to generate an image"
            />
            <div className="m-auto" >
                {isProcessing && <Spinner label="Processing..." />}
            </div>
            <div className={style.imageContainer} >
                {list.map((item, index) => (
                    <div key={index} className="relative" >
                        <div className={style.imageBox} >
                            <A className={style.downloadButton} onClick={() => {
                                window.location.href = (item.url.replace('upload/', 'upload/fl_attachment:download'))
                            }} label={<FiDownload className="size-6" />} />
                            {!isProcessing &&
                                <A className={style.rebuildButton} onClick={() => handleRebuild(index)} label={<FiRefreshCcw className="size-6" />} />
                            }
                            <A className={style.deleteButton} onClick={() => handleDelete(index)} label={<FiTrash className="size-6" />} />
                        </div>
                        <Image
                            key={`img-${index}`}
                            id={`img-${index}`}
                            src={item.url}
                            loader={() => item.url}
                            alt='generated'
                            priority
                            width='0'
                            height='0'
                            sizes="100vw"
                            style={{ width: '512px', height: 'auto' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}