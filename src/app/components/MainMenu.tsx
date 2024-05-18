import { LinkAction } from "./LinkAction";

export const MainMenu = () => {
    return (
        <nav className="flex text-gray-50 bg-blue-800 p-2 m-3 rounded gap-2 sticky top-0">
            <LinkAction label="Home" href="/home" />
            <LinkAction label="Wiki" href="/wiki" />
            <div className="flex-grow"></div>
            <LinkAction label='Login' href='/login' />
        </nav>
    );
}