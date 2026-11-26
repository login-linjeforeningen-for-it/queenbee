'use client'

/* eslint-disable @typescript-eslint/no-unused-expressions */
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Markdown } from './markdown'
import DiscordCardPreview from './card'

type DiscordPreviewProps = {
    channels: Channel[]
    roles: Role[]
    event?: Record<string, unknown> | null
    eventId?: number | null
}

export default function DiscordPreview({ channels, roles, event, eventId }: DiscordPreviewProps) {
    const [titleNo, setTitleNo] = useState('')
    const [titleEn, setTitleEn] = useState('')
    const [descriptionNo, setDescriptionNo] = useState('')
    const [descriptionEn, setDescriptionEn] = useState('')
    const [channel, setChannel] = useState('')
    const [Roles, setRoles] = useState([] as string[])
    const [embed, setEmbed] = useState(true)
    const [color, setColor] = useState('')

    useEffect(() => {
        setTitleNo(localStorage.getItem('title_no') || '')
        setTitleEn(localStorage.getItem('title_en') || '')
        setDescriptionNo(localStorage.getItem('description_no') || '')
        setDescriptionEn(localStorage.getItem('description_en') || '')
        setChannel(localStorage.getItem('channel') || '')
        setRoles((localStorage.getItem('roles') || '').split(' '))
        setEmbed(localStorage.getItem('embed') === 'true')
        setColor(localStorage.getItem('color') || '')
    }, [])

    useEffect(() => {
        function handleStorageChange(e: Event) {
            const event = e as CustomEvent
            event.detail.key === 'title_no' && setTitleNo(event.detail.value)
            event.detail.key === 'title_en' && setTitleEn(event.detail.value)
            event.detail.key === 'description_no' && setDescriptionNo(event.detail.value)
            event.detail.key === 'description_en' && setDescriptionEn(event.detail.value)
            event.detail.key === 'channel' && setChannel(event.detail.value)
            event.detail.key === 'roles' && setRoles((event.detail.value || '').split(' '))
            event.detail.key === 'embed' && setEmbed(event.detail.value === 'true')
            event.detail.key === 'color' && setColor(event.detail.value)
        }

        window.addEventListener('customStorageChange', handleStorageChange)

        return () => {
            window.removeEventListener('customStorageChange',
                handleStorageChange)
        }
    }, [])

    const channelName = channels?.find((c) => c.value === channel)?.label
    const selectedRoles = Roles.filter(Boolean)

    if (event || eventId) {
        return <DiscordCardPreview channelName={channelName} roles={roles} input={{ roles: selectedRoles, event, event_id: eventId }} />
    }

    if (!titleNo && !titleEn) {
        return <></>
    }

    if (embed) {
        return (
            <DiscordCardPreview
                channelName={channelName}
                roles={roles}
                input={{ roles: selectedRoles, color, title: [titleNo, titleEn], description: [descriptionNo, descriptionEn] }}
            />
        )
    }

    const roleNames = selectedRoles.map((role) => roles?.find((r) => r.value === role)?.label).filter(Boolean).map(name => `@${name}`)
    const ping = roleNames.length > 0

    return (
        <div className='bg-[#2b2b2b] rounded-md p-4 text-foreground font-sans shadow-lg'>
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
                        sizes='48px'
                        quality={100}
                    />
                </div>
                <div className='flex flex-col'>
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
                    <div className='grid'>
                        {ping && <span className='text-[#c9cdfb]'>{roleNames.join(' ')}</span>}
                        {titleNo && <span className='font-semibold text-foreground'>
                            <Markdown markdown={format(titleNo, roles)} />
                        </span>}
                        {descriptionNo && <span className='text-[#dcddde] max-w-100 wrap-break-word overflow-hidden'>
                            <Markdown markdown={format(descriptionNo, roles)} />
                        </span>}
                        {(titleNo || descriptionNo) && (titleEn || descriptionEn) && <div className='h-4' />}
                        {titleEn && <span className='font-semibold text-foreground'>
                            <Markdown markdown={format(titleEn, roles)} />
                        </span>}
                        {descriptionEn && <span className='text-[#dcddde] max-w-100 wrap-break-word overflow-hidden'>
                            <Markdown markdown={format(descriptionEn, roles)} />
                        </span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

function format(text: string, roles: Role[]): string {
    return text.replace(/<@&(\d+)>/g, (match, id) => {
        const role = roles.find((item) => item.value === id)
        return role ? `@${role.label}` : match
    })
}
