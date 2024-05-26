import Image from "next/image"

export const ImageBox = ({ image }: { image: string }) => {

    return (
        <div className="overflow-hidden rounded-md border-2 border-white m-2" >
            <Image
                src={image}
                alt='generated'
                priority={false}
                width='0'
                height='0'
                sizes="100vw"
                style={{ width: '100%', height: 'auto', maxWidth: '512px' }}
            />
        </div>
    )
}
