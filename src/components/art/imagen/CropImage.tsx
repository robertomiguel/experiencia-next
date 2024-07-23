import { useCallback, useEffect, useState } from "react"
import Cropper from "react-easy-crop"
import { resizeImage } from "./resizeImage"
import { getCroppedImg } from './canvasUtils'

interface ImagenProps {
    onChange: any
}

export const CropImagen = ({onChange}: ImagenProps) => {
    const [imagen, setImagen] = useState<any>('')
    const [imagenCrop, setImagenCrop] = useState<any>('')
    const [verEnVertical, setVerEnVertical] = useState<boolean>(true)
    const [crop, setCrop] = useState({ x: 768, y: 1024 })
    const [rotation, setRotation] = useState(0)
    const [zoomImg, setZoomImg] = useState(1)
    const [debounceTimeout, setDebounceTimeout] = useState<any>(null);

    const onCropComplete = useCallback(async (_: any, croppedImg: any) => {
        const croppedImage = await getCroppedImg(
            imagen,
            croppedImg,
            rotation
        )
        const medidas = verEnVertical ? [768, 1024] : [1024, 768]
        setImagenCrop(await resizeImage(croppedImage, medidas[0], medidas[1]))
    }, [imagen, rotation, verEnVertical])

    useEffect(()=>{
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            onChange({
                imagen: imagenCrop ? imagenCrop : undefined,
            });
        }, 500); // Cambia este valor según el delay deseado
        setDebounceTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imagenCrop, zoomImg, rotation]);

    return <div className="flex flex-col w-full justify-around">
        <div className="flex flex-col gap-2 pl-2" >
            <label>Select reference image</label>
            <input
                className="w-fit"
                type={'file'}
                onChange={(e) => {
                    const file = e.target.files && e.target.files[0]
                    if (FileReader && file) {
                        const fr = new FileReader()
                        fr.onload = function () {
                            setImagen(fr.result)
                        }
                        fr.readAsDataURL(file)
                    }            
            }}/>
        </div>
        <div className="flex flex-row w-full justify-around">
        {imagen && <>
            <div
                className="relative bg-white w-[500px] h-[500px] inline-block border-2 border-blue-300"
            >
                <Cropper
                    image={imagen}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoomImg}
                    aspect={verEnVertical ? 3 / 4 : 4 / 3}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoomImg}
                />
            </div>
            <div className="flex flex-col w-1/5 bg-blue-800 p-3 h-fit rounded-lg gap-4 justify-start items-start ">
                <div className="flex flex-row gap-2 h-4 text-nowrap mb-2 " >
                    <input type="checkbox" checked={verEnVertical} onChange={ () => {
                            setVerEnVertical(prev => !prev)
                        }}
                    />
                    <label>Pantalla vertical</label>
                </div>
                <div className="flex flex-col gap-1 text-nowrap w-full" >
                    <label>ZOOM</label>
                    <input
                        type="range"
                        step={.1}
                        min={1}
                        max={10}
                        value={zoomImg}
                        onChange={e => setZoomImg(parseFloat(e.target.value))}
                    />
                </div>
                <div className="flex flex-col gap-1 text-nowrap w-full" >
                    <label>ROTAR</label>
                    <input
                        type="range"
                        step={.1}
                        min={0}
                        max={360}
                        value={rotation}
                        onChange={e => setRotation(parseInt(e.target.value))}
                    />
                </div>
            </div>
        </>
        }
        </div>
    </div>
}