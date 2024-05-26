'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import style from './ItemMenu.module.css'

interface Props {
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
}

export const ItemMenu = ({ title, description, icon, path }: Props) => {

    const pathName = usePathname()

    return (
        <Link
            href={path}
            className={`${style.link}  ${pathName.includes(path) ? style.selectedColor : style.defaultColor}`}
        >
            <div>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className={style.title}>{title}</span>
                <span className={style.description}>{description}</span>
            </div>
        </Link>
    )

}