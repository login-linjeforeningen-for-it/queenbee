/* eslint-disable @typescript-eslint/no-unused-expressions */
import Image from 'next/image'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { useEffect, useRef, useState } from 'react'
import { Markdown } from './markdown'
import { RoleRenderer } from './discordRole'

export default function DiscordPreview({ channels, roles }: { channels: Channel[], roles: Role[] }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [channel, setChannel] = useState('')
    const [Roles, setRoles] = useState([] as string[])
    const [embed, setEmbed] = useState(true)
    const [color, setColor] = useState('')
    const formattedColor = formatColor(color)
    const boxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setTitle(localStorage.getItem('title') || '')
        setDescription(localStorage.getItem('description') || '')
        setChannel(localStorage.getItem('channel') || '')
        setRoles((localStorage.getItem('roles') || '').split(' '))
        setEmbed(localStorage.getItem('embed') === 'true')
        setColor(localStorage.getItem('color') || '')
    }, [])

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
            event.detail.key === 'roles' && setRoles(event.detail.value.split(' '))
            event.detail.key === 'embed' && setEmbed(event.detail.value === 'true')
            event.detail.key === 'color' && setColor(event.detail.value)
            event.detail.key === 'description' && setDescription(event.detail.value)
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

    const channelName = channels?.find((c) => c.value === channel)?.label
    let roleColor = '#fd8738'
    const roleNames = Roles.map((role) => {
        const match = roles.find((r) => r.value === role)
        if (match !== undefined) {
            roleColor = match.color
            return `@${match.label}`
        }

        return undefined
    }).join(' ')
    const ping = Roles.length > 0 && Roles[0].length > 0

    return (
        <div className={
            'bg-[#2b2b2b] rounded-md p-4 ' +
            'text-foreground font-sans shadow-lg'
        }>
            {/* Channel Name */}
            <p className='text-[#72767d] text-sm mb-2'># {channelName}</p>

            <div
                className={`flex rounded-md p-3 gap-2 ${ping && 'border-l-2 border-login bg-login/15'}`}
                style={{
                    borderLeft: ping ? '4px solid #fd8738' : 'none',
                    borderTop: 'none',
                    borderRight: '12px solid #00000000',
                    borderBottom: 'none'
                }}
            >
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
                        <div className='mt-1'>
                            {ping && (
                                <Ping color={roleColor} names={roleNames} />
                            )}
                            <div
                                className='p-3 mt-2 rounded-lg'
                                style={{
                                    backgroundColor: '#2f3136',
                                    borderLeft: embed ? `4px solid ${formattedColor}` : 'none',
                                    borderTop: 'none',
                                    borderRight: '12px solid #00000000',
                                    borderBottom: 'none'
                                }}
                            >
                                {title && (
                                    <div className='max-w-100 break-words overflow-hidden'>
                                        <Markdown className='font-semibold text-foreground' markdown={format(title, roles)} />
                                    </div>
                                )}
                                {description && (
                                    <div className='max-w-100 break-words overflow-hidden -mb-1 text-[#dcddde]'>
                                        <Markdown markdown={format(description, roles)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : <div className='grid'>
                        <span className='font-semibold text-foreground'>
                            <Markdown markdown={format(title, roles)} />
                        </span>
                        <span className='text-[#dcddde] max-w-100 break-words overflow-hidden'>
                            <Markdown markdown={format(description, roles)} />
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

function Ping({ color, names }: { color: string, names: string }) {
    return (
        <p
            style={{ color: color, backgroundColor: `${color}26` }}
            className='text-foreground w-fit rounded-sm px-1'>{names}
        </p>
    )
}

function format(text: string, roles: Role[]): string {
    const regex = /<@&(\d+)>/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    let result = ''

    while ((match = regex.exec(text)) !== null) {
        const roleId = match[1]
        const start = match.index

        if (start > lastIndex) {
            result += text.slice(lastIndex, start)
        }

        const spanElement = RoleRenderer({ roleId, roles })
        if (spanElement) {
            result += renderToString(spanElement)
        } else {
            result += match[0]
        }

        lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
        result += text.slice(lastIndex)
    }

    return result
}
