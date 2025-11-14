import Image from 'next/image'
import Notification from './notification'

type PreviewProps = {
    title: string
    description: string
    small?: boolean
}

export default function Preview({ title, description, small }: PreviewProps) {
    if (!title.length) {
        return <></>
    }

    return (
        <div className='relative min-h-full max-h-full overflow-hidden'>
            <h1
                className={
                    'relative text-2xl font-bold tracking-tight ' +
                    `text-foreground z-100 ${small ? 'mb-2' : ''}`
                }
            >
                Preview
            </h1>
            <Notification
                title={title}
                description={description}
                small={small}
            />
            <div
                className={
                    'hidden lg:block relative w-full ' +
                    'aspect-1/2 -mt-10 -ml-10'
                }
            >
                <Image
                    alt='Logo'
                    src='/images/iphone-events.png'
                    fill={true}
                    quality={100}
                    className='object-contain'
                />
            </div>
        </div>
    )
}
