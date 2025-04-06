import { Dispatch, SetStateAction } from "react"

type ButtonProps = {
    text: string
    icon: string
    handleClick: Dispatch<SetStateAction<any>>
}

export default function Button({text, icon, handleClick}: ButtonProps) {
    return (
        <div className="bg-login cursor-pointer px-4 rounded-md h-8 flex justify-evenly items-center gap-2 select-none" onClick={handleClick}>
            <h1 className="font-bold">{icon ? `${icon}` : ''}</h1>
            <h1 className="">{text}</h1>
        </div>
    )
}
