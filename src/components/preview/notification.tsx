import Image from 'next/image'

type NotificationProps = {
    title: string
    description: string
    small?: boolean
}

type ContentProps = {
    title: string
    description: string
}

export default function Notification({
    title,
    description,
    small,
}: NotificationProps) {
    if (!title.length) {
        return <></>
    }

    const formattedTitle =
        title.length > 60 ? `${title.slice(0, 60)}...` : title
    const formattedDescription =
        description.length > 120
            ? `${description.slice(0, 120)}...`
            : description

    if (small) {
        return (
            <div
                className={
                    'absolute w-76 p-2 px-3 rounded-lg ' +
                    'backdrop-blur-md bg-black/10 z-100'
                }
            >
                <Content
                    title={formattedTitle}
                    description={formattedDescription}
                />
            </div>
        )
    }

    return (
        <div
            className={
                'absolute w-76 p-2 px-3 rounded-lg ' +
                'backdrop-blur-md bg-black/10 z-100 left-1/2 ' +
                '-translate-x-1/2 mt-21 -ml-9.5'
            }
        >
            <Content
                title={formattedTitle}
                description={formattedDescription}
            />
        </div>
    )
}

function Content({ title, description }: ContentProps) {
    return (
        <div className='h-full w-full flex gap-2'>
            <div className='relative h-full w-8 aspect-square self-center'>
                <Image
                    fill
                    alt='Logo'
                    src='/images/queenbee-logo.png'
                    quality={100}
                    className='object-contain h-full'
                    sizes='(max-width: 400px) 40vw, 40vw'
                />
            </div>
            <div className='w-full'>
                <div className='flex justify-between'>
                    {/* prettier-ignore */}
                    <h1 className={
                        'text-foreground font-semibold text-xs w-full max-w-[90%]'
                    }>
                        {title}
                    </h1>
                    <h1 className='text-login-200 text-xs'>nå</h1>
                </div>
                <p className='text-foreground/80 text-xs max-w-[96%]'>
                    {description}
                </p>
            </div>
        </div>
    )
}
