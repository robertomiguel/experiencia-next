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
import { DeleteAction } from "./delete.action";
import { SettingsForm } from "./SettingsForm";
import { useAppDispatch, useAppSelector } from "@/store";
import { toogleSidesheet } from "@/store/settingsSlice";
import { Drawer } from "../common/Drawer";

export const metadata: Metadata = {
    title: "ID Images",
    description: "ID inteligencia digital",
    keywords: ['images', 'ia', 'generator', 'free', 'stable', 'diffusion']
};

const goTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}

export const MakeImage = () => {

    const [list, setList] = useState<ImageItem[]>([])
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [indexZoom, setIndexZoom] = useState<number | null>(null)
    const [valueText, setValueText] = useState<string>('')
    const [model, setModel] = useState<number>(3)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [showToUpButton, setShowToUpButton] = useState<boolean>(false)
    const [isReady, setIsReady] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const isSettingsOpen = useAppSelector(state => state.settings.openSidesheet)

    const handleGenerate = async (prompt: string, modelId?: number) => {
        setModel(modelId || model)
        setValueText(prompt)
        dispatch(toogleSidesheet(false))
        let text = prompt
        try {
            setIsProcessing(true)
            const res: GenerateRes = await GenerateAction({ prompt: text, model: modelId || model })
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
                goTop()
                break
            }
        }
    }

    useEffect(() => {
        const localList = localStorage.getItem('drawList')
        const initialList = localList ? JSON.parse(localList) : []
        setList(initialList)
        setIsReady(true)

        const handleScroll = () => {
            const top = window.scrollY;
            setShowToUpButton(top > 1);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [])

    const handleDelete = async (index: number) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return
        setIsDeleting(true)
        const url = list[index].url
        const publicId = url.split('/').slice(-3).join('/').split('.')[0]
        const res = await DeleteAction(publicId)
        let confirm = true
        if (!res) {
            confirm = window.confirm('Error deleting image from server, delete from your local list?')
        }
        if (confirm) {
            const newList = list.filter((_, i) => i !== index)
            setList(newList)
            localStorage.setItem('drawList', JSON.stringify(newList))
        }
        setIsDeleting(false)
    }

    const handleRebuild = async (index: number) => {
        await handleGenerate(list[index].prompt)
    }

    const handleZoom = (index: number) => {
        setIndexZoom(indexZoom === index ? null : index)
    }

    const isEmptyList = list.length === 0

    return (
        <div>
            {showToUpButton && !isSettingsOpen &&
                <button
                    onClick={goTop}
                    className="fixed z-30 bottom-12 right-4 bg-blue-500 text-white rounded-full w-fit hover:bg-blue-600" >
                    Up
                </button>
            }

            {isSettingsOpen &&
                <Drawer onClose={() => dispatch(toogleSidesheet(false))} title="Settings" >
                    <SettingsForm generate={handleGenerate} />
                </Drawer>
            }

            <div className="m-auto" >
                {isProcessing && <Spinner label="Processing..." />}
            </div>

            {isReady && !isProcessing &&
                <div className={
                    isEmptyList
                        ? "text-center m-auto w-fit mt-40 text-gray-500"
                        : "mb-3 w-fit m-auto sticky top-11 z-10 p-2 bg-blue-950 bg-opacity-70 rounded-full"
                } >
                    {isEmptyList && <h4>No images yet...</h4>}
                    <button
                        className={
                            isEmptyList
                                ? "f-full sm:w-fit mt-10"
                                : "f-full sm:w-fit"
                        }
                        onClick={() => dispatch(toogleSidesheet(true))}
                    >
                        {isEmptyList
                            ? 'Generate your first image'
                            : 'Generate new image'
                        }
                    </button>
                </div>
            }

            <div className={style.imageContainer} >
                {list.map((item, index) => (
                    <div key={index} className="relative" >
                        <ImageActions
                            index={index}
                            url={item.url}
                            isProcessing={isProcessing}
                            isDeleting={isDeleting}
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
                            className="rounded-lg"
                            style={{ width: indexZoom === index ? '1024px' : '512px', height: 'auto' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}