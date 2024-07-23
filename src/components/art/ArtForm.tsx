/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from "react";
import {artGet} from "./artGet";
import { artGetSD15 } from "./artGetSD15";
import { CropImagen } from "./imagen/CropImage";
import Image from "next/image";

export const ArtForm = () => {

    const [imgData, setImgData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>('');
    const [refImage, setRefImage ] = useState<string>('')
    const [showLoadImg, setShowLoadImg] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            const i: any = await artGet({ prompt, faceData: refImage });
            setImgData(prev => [i.image, ...prev]);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSubmit2 = async () => {
        try {
            const i: any = await artGetSD15({ prompt, faceData: refImage });
            setImgData(prev => [i.url, ...prev ]);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            {showLoadImg && <div className="p-2" >
                <CropImagen onChange={ (v: any) => {
                    if (v?.imagen) {
                        setRefImage(v.imagen)
                    }
                }} />
            </div>}

            <div className="flex flex-row p-2">
                {refImage && <img className="w-[150px]" src={refImage} alt="ref" />}
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Image description..." />
            </div>

            <div className="flex flex-row gap-2 p-2" >

                <button
                    className="w-fit text-nowrap"
                    onClick={() => setShowLoadImg(!showLoadImg)}
                >
                    {showLoadImg ? 'Hide' : 'Show'} Ref Image
                </button>

                <button disabled={isLoading} onClick={async () => {
                    if (!prompt.trim()) return;
                    setIsLoading(true);
                    try {
                        await Promise.all([
                            handleSubmit(), handleSubmit(), handleSubmit(), handleSubmit(),
                        ]);
                    } finally {
                        setIsLoading(false);
                    }
                }} >Fast generation</button>

                <button disabled={isLoading} onClick={async () => {
                    if (!prompt.trim()) return;
                    setIsLoading(true);
                    try {
                        await Promise.all([
                            handleSubmit2(), handleSubmit2(), handleSubmit2(), handleSubmit2(),
                        ]);
                    } finally {
                        setIsLoading(false);
                    }
                }} >Realistic</button>
                <button className="w-fit" onClick={() => setImgData([])} >Clear</button>
            </div>
            <div className="flex justify-center items-center p-2 flex-wrap gap-2" >
                {imgData.map((i, idx) => (
                    <Image
                        key={idx}
                        src={i}
                        alt='generated'
                        priority={false}
                        width='0'
                        height='0'
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto', maxWidth: '1024px' }}
                    />
                ))}
            </div>
        </div>
    )
}
