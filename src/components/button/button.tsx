import Link from 'next/link'

type ButtonProps = {
    text: string
    icon: string
    path?: string
    color?: 'primary' | 'secondary'
    onClick?: (_: object) => void
}

export default function Button({
    text,
    icon,
    path,
    color,
    onClick,
}: ButtonProps) {
    const bg = color === 'secondary' ? 'bg-login-600' : 'bg-login'

    if (!path) {
        return (
            <button
                type='button'
                onClick={onClick}
                className={
                    `${bg} cursor-pointer px-4 rounded-md h-8 flex ` +
                    'justify-evenly items-center gap-2 select-none ' +
                    'focus:outline-none border-0'
                }
            >
                <h1 className='font-bold'>{icon ? icon : ''}</h1>
                <h1>{text}</h1>
            </button>
        )
    }

    return (
        <Link
            href={path}
            className={
                `${bg} cursor-pointer px-4 rounded-md h-8 flex ` +
                'justify-evenly items-center gap-2 select-none'
            }
        >
            <h1 className='font-bold'>{icon ? `${icon}` : ''}</h1>
            <h1 className=''>{text}</h1>
        </Link>
    )
}
