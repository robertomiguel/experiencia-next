import { WikiDataList } from "@/types/wikipedia";
import Image from "next/image";
import style from './WikiList.module.css'

export const WikiItem = ({ item }: { item: WikiDataList }) => {

    const addHtmlStyle = (html: string) => {
        const searchmatch = html
            .replace(/class="searchmatch">/g, 'style="color: blue;">')

        return { __html: searchmatch }
    }

    return (
        <div key={item.id} className={style.boxContainer}>
            <div className={style.imageContainer} >
                <Image
                    src={`https:${item?.imageUrl}`}
                    alt={item.title}
                    priority={false}
                    width='0'
                    height='0'
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto', maxWidth: '128px' }}
                />
            </div>
            <div className={style.title}>{item.title}</div>
            <div className={style.detailContainer} >
                <div dangerouslySetInnerHTML={addHtmlStyle(item.description)} className={style.description} />
            </div>
        </div>
    );
}