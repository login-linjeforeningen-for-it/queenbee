/* eslint-disable @typescript-eslint/no-unused-expressions */
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function DiscordPreview() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [channel, setChannel] = useState('')
    const [embed, setEmbed] = useState(true)
    const [color, setColor] = useState('')
    const formattedColor = formatColor(color)
    const boxRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (boxRef.current) {
            const el = boxRef.current
            el.style.borderColor = embed ? formattedColor : 'none'
            el.style.borderLeft = embed ? `4px solid ${formattedColor}` : 'none'
            el.style.borderTop = '0px solid #2f3136'
            el.style.borderRight = '0px solid #2f3136'
            el.style.borderBottom = '0px solid #2f3136'
        }
    }, [formattedColor, embed])

    useEffect(() => {
        function handleStorageChange(e: Event) {
            const event = e as CustomEvent
            event.detail.key === 'title' && setTitle(event.detail.value)
            event.detail.key === 'channel' && setChannel(event.detail.value)
            event.detail.key === 'embed' && setEmbed(event.detail.value === 'true')
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
            'text-foreground font-sans shadow-lg'
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
                            'font-semibold text-foreground text-sm '
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
                            className='p-3 mt-2 rounded-lg'
                            style={{
                                backgroundColor: '#2f3136',
                                borderLeft: embed ? `4px solid ${formattedColor}` : 'none',
                                borderTop: 'none',
                                borderRight: '12px solid #2f3136',
                                borderBottom: 'none'
                            }}
                        >
                            {title && (
                                <p className='font-semibold text-foreground'>{title}</p>
                            )}
                            {description && (
                                <p className='text-[#dcddde] mt-1'>{description}</p>
                            )}
                        </div>
                    ) : <div className='grid'>
                        <span className='font-semibold text-foreground'>
                            {title}dd
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
    const normalized = color.trim().toLowerCase()
    if (!color.trim().length) return 'white'

    // Checks if it's a valid CSS color name
    const s = new Option().style
    s.color = normalized
    if (s.color) return normalized

    // Otherwise, treat as hex
    if (!normalized.startsWith('#')) return `#${normalized}`
    return normalized
}
