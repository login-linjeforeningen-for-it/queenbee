'use client'

import { useEffect, useState } from 'react'
import previewAnnouncement from '@utils/api/bot/announcements/previewAnnouncement'
import type { CardComponent, CardPreview, CardPreviewInput } from '@utils/api/bot/announcements/previewAnnouncement'
import { Markdown } from './markdown'

type CardPreviewProps = {
    input: CardPreviewInput
    roles: Role[]
    channelName?: string
}

export default function DiscordCardPreview({ input, roles, channelName }: CardPreviewProps) {
    const [preview, setPreview] = useState<CardPreview | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const key = JSON.stringify(input)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        const timer = setTimeout(async () => {
            const result = await previewAnnouncement(JSON.parse(key))
            if (cancelled) return
            setLoading(false)
            if (typeof result === 'string') {
                setError(result)
            } else {
                setError(null)
                setPreview(result)
            }
        }, 600)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [key])

    return (
        <div className='bg-[#323339] rounded-md p-4 text-[#dbdee1] font-sans shadow-lg h-fit'>
            <div className='flex justify-between text-sm mb-3'>
                <span className='text-[#949ba4]'># {channelName || 'kanal'}</span>
                {loading && <span className='text-[#949ba4]'>Oppdaterer forhåndsvisning…</span>}
            </div>
            {error && <p className='text-sm text-red-400 mb-2'>{error}</p>}
            {preview && (
                <div className='flex gap-4'>
                    <img src='/images/tekkom.png' alt='TekKom' className='w-10 h-10 rounded-full shrink-0' />
                    <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-1 mb-1'>
                            <span className='font-semibold text-white'>TekKom</span>
                            <span className='bg-[#5865f2] text-white text-[10px] font-bold px-1 rounded'>APP</span>
                        </div>
                        <div className='flex flex-col gap-2'>
                            {preview.components.map((component, i) => (
                                <Component key={i} component={component} files={preview.files} roles={roles} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

type ComponentProps = {
    component: CardComponent
    files: Record<string, string>
    roles: Role[]
}

function Component({ component, files, roles }: ComponentProps) {
    const children = (component.components ?? []) as CardComponent[]

    switch (component.type) {
        case 17: {
            const accent = component.accent_color as number | undefined
            return (
                <div
                    className='bg-[#393a41] border border-[#44454c] rounded-lg p-4 flex flex-col gap-2 max-w-130'
                    style={{ borderLeft: accent === undefined ? undefined : `4px solid #${accent.toString(16).padStart(6, '0')}` }}
                >
                    {children.map((child, i) => <Component key={i} component={child} files={files} roles={roles} />)}
                </div>
            )
        }
        case 10:
            return <Text content={component.content as string} roles={roles} />
        case 14:
            return component.divider === false
                ? <div className={component.spacing === 2 ? 'h-4' : 'h-1'} />
                : <hr className={`border-[#4e505866] ${component.spacing === 2 ? 'my-2' : 'my-0.5'}`} />
        case 12: {
            const items = component.items as { media: { url: string } }[]
            return (
                <div className='grid gap-1 rounded-lg overflow-hidden'>
                    {items.map((item, i) => <img key={i} src={files[item.media.url] ?? item.media.url} alt='' className='w-full' />)}
                </div>
            )
        }
        case 1:
            return (
                <div className='flex flex-wrap gap-2'>
                    {children.map((child, i) => <Component key={i} component={child} files={files} roles={roles} />)}
                </div>
            )
        case 2: {
            const emoji = (component.emoji as { name?: string } | undefined)?.name
            return (
                <a
                    href={component.url as string}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='h-8 px-4 rounded-lg bg-[#4e5058] text-white text-sm font-medium inline-flex items-center gap-1'
                >
                    {emoji} {component.label as string} ↗
                </a>
            )
        }
        default:
            return <>{children.map((child, i) => <Component key={i} component={child} files={files} roles={roles} />)}</>
    }
}

function Text({ content, roles }: { content: string, roles: Role[] }) {
    const withRoles = content.replace(/<@&(\d+)>/g, (match, id) => {
        const role = roles.find(r => r.value === id)
        return role ? `**@${role.label}**` : match
    })

    const blocks: { small: boolean, text: string }[] = []
    for (const line of withRoles.split('\n')) {
        const small = line.startsWith('-# ')
        const text = small ? line.slice(3) : line
        const last = blocks[blocks.length - 1]
        if (last && last.small === small) {
            last.text += `\n${text}`
        } else {
            blocks.push({ small, text })
        }
    }

    return (
        <div>
            {blocks.map((block, i) => (
                <Markdown
                    key={i}
                    markdown={block.text}
                    className={block.small ? 'text-xs! text-[#949ba4]!' : ''}
                />
            ))}
        </div>
    )
}
