import { LinkAction } from "./LinkAction";

export const MainMenu = () => {

    const menuItems = [
        { label: 'Home', href: '/home' },
        { label: 'Wiki', href: '/wiki' },
        { label: 'Images', href: '/images' },
    ];
    return (
        <nav className="flex z-10 text-gray-50 bg-blue-800 p-2 pl-4 pr-4 m-3 rounded-full gap-3 sticky top-0">
            {menuItems.map((item) => (
                <LinkAction key={item.href} label={item.label}
                    href={item.href} />
            ))}
            <div className="flex-grow"></div>
            <LinkAction label='Account' href='/login' />
        </nav>
    );
}