
interface MenuButtonProps {
  onClick: () => void;
  text?: string;
  icon?: any
}

export const MenuButton = ({ onClick, text, icon }: MenuButtonProps) => {

    return (
      <button
        className="bg-transparent w-fit h-fit rounded-full focus:bg-transparent"
        onClick={onClick}
      >
        {text && <span>{text}</span>}
        {icon && <span>{icon}</span>}
      </button>
    );
}