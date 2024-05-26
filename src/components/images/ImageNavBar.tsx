import { ItemMenu } from "@/components/images/ItemMenu";
import { FiEyeOff, FiImage, FiSettings } from "react-icons/fi";

const menuItems = [
    {
        title: "Images",
        description: "Generated image",
        icon: <FiImage className="w-8 h-8 size-8" />,
        path: "/images",
    },
    {
        title: "Hidden Images",
        description: "Private content",
        icon: <FiEyeOff className="w-8 h-8 size-8" />,
        path: "/private",
    },
    {
        title: "Generate",
        description: "IA Stable diffussion",
        icon: <FiSettings className="w-8 h-8 size-8" />,
        path: "/generate",
    },
];


export const ImageNavBar = () => {
    return (
        <nav className="flex flex-row m-2 gap-1">
            {menuItems.map((item) => (
                <ItemMenu
                    key={item.title}
                    {...item}
                    path={item.path}
                />
            ))}
        </nav>
    )
}