import { WikiDataList } from '@/types/wikipedia';
import style from './WikiList.module.css'
import { WikiItem } from './WikiItem';

export default function WikiList({ list }: { list: any }) {

    return (<>
        <div className='mr-4 mt-3 flex justify-center '>
            Total de resultados: {list.length}
        </div>
        <div className={style.list} >
            {list.map((item: WikiDataList) => {
                return (
                    <WikiItem key={item.id} item={item} />
                )
            })}
        </div>
    </>);
}