import Image from "next/image"

type NotificationProps = {
    title: string
    description: string
    small?: boolean
}

type ContentProps = {
    title: string
    description: string
}

export default function Notification({title, description, small}: NotificationProps) {
    if (!title.length) {
        return <></>
    }

    const formattedTitle = title.length > 60 ? `${title.slice(0, 60)}...` : title
    const formattedDescription = description.length > 120 ? `${description.slice(0, 60)}...` : description

    if (small) {
        return (
            <div className="absolute w-[19rem] p-2 px-3 rounded-xl backdrop-blur-md bg-black/10 z-100">
                <Content title={formattedTitle} description={formattedDescription} />
            </div>
        )  
    }

    return (
        <div className="absolute w-[19rem] p-2 px-3 rounded-xl backdrop-blur-md bg-black/10 z-100 left-1/2 -translate-x-1/2 mt-21 -mt-10 -ml-9.5">
            <Content title={formattedTitle} description={formattedDescription} />
        </div>
    )    
}

function Content({title, description}: ContentProps) {
    return (
        <div className="h-full w-full flex gap-2">
            <div className="relative h-full w-[2rem] aspect-square self-center">
                <Image fill alt='Logo' src='/images/queenbee-logo.png' quality={100} className='object-contain h-full' />
            </div>
            <div className="w-full">
                <div className="flex justify-between">
                    <h1 className="text-white font-semibold text-xs w-full max-w-[90%]">{title}</h1>
                    <h1 className="text-login-200 text-xs">nå</h1>
                </div>
                <p className="text-white/80 text-xs max-w-[96%]">{description}</p>
            </div>
        </div>
    )
}
