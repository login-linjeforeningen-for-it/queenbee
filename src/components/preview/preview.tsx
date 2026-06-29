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
        <div className='relative h-88 overflow-hidden rounded-2xl border border-white/5 bg-login-50/5 p-4'>
            <p className={`relative z-100 text-xs font-semibold uppercase tracking-wider text-login-300 ${small ? 'mb-2' : ''}`}>
                Preview
            </p>
            {hasContent ? (
                <Notification
                    title={title}
                    description={description}
                    small={small}
                />
            ) : (
                <div className='mt-4 rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
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
