import { twMerge } from "tailwind-merge"

interface BoxPorps {
    children: React.ReactNode,
    className: string
}

const Box: React.FC<BoxPorps> = ({ children, className }) => {
    return (<div className={twMerge(`bg-neutral-900 rounded-lg h-fit w-full`, className)}>{children}</div>);
}

export default Box;