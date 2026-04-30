import Image from 'next/image'
import Notification from './notification'

type PreviewProps = {
    title: string
    description: string
    small?: boolean
}

export default function Preview({ title, description, small }: PreviewProps) {
    const hasContent = title.length > 0

    return (
        <div className='relative h-88 overflow-hidden rounded-2xl border border-login-100/10 bg-login-900/35 p-4'>
            <h1
                className={`
                    relative text-2xl font-bold tracking-tight
                    text-foreground z-100 ${small ? 'mb-2' : ''}
                `}
            >
                Preview
            </h1>
            {hasContent ? (
                <Notification
                    title={title}
                    description={description}
                    small={small}
                />
            ) : (
                <div className='mt-10 rounded-xl border border-login-100/10 bg-black/10 p-4 text-sm text-login-200'>
                    Fill in a title to preview the notification.
                </div>
            )}
            <div className='hidden lg:block relative w-full aspect-1/2 -mt-10 -ml-10'>
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
