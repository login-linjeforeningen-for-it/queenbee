import Link from "next/link"

type ButtonProps = {
    text: string
    icon: string
    path: string
}

export default function Button({text, icon, path}: ButtonProps) {
    return (
        <Link href={path} className="bg-login cursor-pointer px-4 rounded-md h-8 flex justify-evenly items-center gap-2 select-none">
            <h1 className="font-bold">{icon ? `${icon}` : ''}</h1>
            <h1 className="">{text}</h1>
        </Link>
    )
}
