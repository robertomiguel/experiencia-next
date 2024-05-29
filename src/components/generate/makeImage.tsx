'use client'

import { useEffect, useState } from "react"
import { GenerateAction } from "./generate.action"
import { GetImageAction } from "./getImage.action"
import { FormSearchInput } from "../common/FormSearchInput";
import Image from "next/image";
import style from './makeImage.module.css'
import { Spinner } from "../common/Spinner";
import { GenerateRes, ImageItem, ProcessRes } from "@/types/iaDraw";
import { ImageActions } from "./ImageActions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ID Images",
    description: "ID inteligencia digital",
    keywords: ['images', 'ia', 'generator', 'free', 'stable', 'diffusion']
};


export const MakeImage = () => {

    const [list, setList] = useState<ImageItem[]>([])
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [indexZoom, setIndexZoom] = useState<number | null>(null)
    const [valueText, setValueText] = useState<string>('')

    const handleGenerate = async (prompt: string) => {
        let text = prompt
        try {
            setIsProcessing(true)
            const res: GenerateRes = await GenerateAction({ prompt: text })
            if (res.job) await handleProcess(res.job)
        } catch (error) {
            console.log('error proccess', error);
        } finally {
            setIsProcessing(false)
        }
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

    const handleZoom = (index: number) => {
        setIndexZoom(indexZoom === index ? null : index)
    }

    return (
        <div>
            <FormSearchInput
                onSubmit={handleGenerate}
                disabled={isProcessing}
                placeholder='Describe the image in english...'
                value={valueText}
                onChange={t => setValueText(t)}
            />
            <div className="m-auto" >
                {isProcessing && <Spinner label="Processing..." />}
            </div>
            <div className={style.imageContainer} >
                {list.map((item, index) => (
                    <div key={index} className="relative" >
                        <ImageActions
                            index={index}
                            url={item.url}
                            isProcessing={isProcessing}
                            onRebuild={handleRebuild}
                            onDelete={handleDelete}
                            onZoom={handleZoom}
                            isZoom={indexZoom === index}
                        />
                        <Image
                            key={`img-${index}`}
                            id={`img-${index}`}
                            src={item.url}
                            loader={() => item.url + '?width=512'}
                            alt='generated'
                            priority
                            width='0'
                            height='0'
                            sizes="100vw"
                            style={{ width: indexZoom === index ? '1024px' : '512px', height: 'auto' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}