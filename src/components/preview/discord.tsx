/* eslint-disable @typescript-eslint/no-unused-expressions */
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function DiscordPreview() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [channel, setChannel] = useState('')
    const [embed, setEmbed] = useState(true)
    const [color, setColor] = useState('')
    const formattedColor = formatColor(color)
    useEffect(() => {
        function handleStorageChange(e: Event) {
            const event = e as CustomEvent
            event.detail.key === 'title' && setTitle(event.detail.value)
            event.detail.key === 'channel' && setChannel(event.detail.value)
            event.detail.key === 'embed' && setEmbed(event.detail.value)
            event.detail.key === 'color' && setColor(event.detail.value)
            event.detail.key === 'description'
                && setDescription(event.detail.value)
        }

        window.addEventListener('customStorageChange', handleStorageChange)

        return () => {
            window.removeEventListener('customStorageChange',
                handleStorageChange)
        }
    }, [])

    if (!title) {
        return <></>
    }

    return (
        <div className={
            'bg-[#2b2b2b] rounded-md p-4 ' +
            'text-white font-sans shadow-lg'
        }>
            {/* Channel Name */}
            <p className='text-[#72767d] text-sm mb-2'># {channel}</p>

            <div className='flex rounded-md p-3 gap-2'>
                <div className='w-12 h-12 aspect-square relative'>
                    <Image
                        src='/images/tekkom.png'
                        alt='TekKom Discord Logo'
                        className='rounded-full object-cover'
                        fill
                        quality={100}
                    />
                </div>
                {/* Message Bubble */}
                <div className={
                    'flex flex-col'
                }>
                    <div className='flex gap-2'>
                        <span className='font-semibold text-blue-400 text-sm'>
                            TekKom
                        </span>
                        <span className={
                            'font-semibold text-white text-sm '
                            + 'bg-[#5865F2] rounded-md px-2'
                        }>
                            APP
                        </span>
                        <span className='text-[#5f5f5f] text-sm'>
                            Yesterday at 15:13
                        </span>
                    </div>
                    {/* Optional Embed */}
                    {embed ? (
                        <div
                            className='border-l-4 p-3 mt-2 rounded-lg'
                            style={{
                                borderColor: formattedColor,
                                backgroundColor: '#2f3136',
                                borderTop: '1px solid transparent',
                                borderRight: '1px solid transparent',
                                borderBottom: '1px solid transparent',
                            }}
                        >
                            {title && (
                                <p className='font-semibold text-white'>
                                    {title}
                                </p>
                            )}
                            {description && (
                                <p className='text-[#dcddde] mt-1'>
                                    {description}
                                </p>
                            )}
                        </div>
                    ) : <div>
                        <span className='font-semibold text-white'>
                            {title}
                        </span>
                        <span className='text-[#dcddde]'>
                            {description}
                        </span>
                    </div>}
                </div>
            </div>
        </div>
    )
}

function formatColor(color: string) {
    if (!color.startsWith('#')) return `#${color}`
    return color
}
