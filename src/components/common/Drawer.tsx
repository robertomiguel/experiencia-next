
interface DrawerProps {
    onClose: () => void
    children: React.ReactNode
    title?: string
}

export const Drawer = ({ children, onClose, title }: DrawerProps) => {

    return (
        <div className="fixed p-2 top-0 bottom-0 right-0 w-full sm:w-1/3 bg-blue-900 bg-opacity-90 shadow-lg " >
            <div className="flex flex-row justify-between items-center " >
                <h1>{title}</h1>
                <button className="w-8 h-8 p-2 rounded-full  " onClick={() => onClose()} >X</button>
            </div>
            <div className="w-full m-2" >
                {children}
            </div>
        </div>
    )
}