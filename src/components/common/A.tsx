
interface Props {
    onClick: () => void
    label: any
    className?: string
}

export const A = ({ onClick, label, className }: Props) => {

    return <a className={`hover:cursor-pointer ${className}`} onClick={e => {
        e.preventDefault()
        onClick()
    }} rel="noreferrer">{label}</a>
}