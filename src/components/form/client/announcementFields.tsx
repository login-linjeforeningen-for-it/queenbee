'use client'

import { Input, Textarea, Select, Switch, Button } from 'uibee/components'
import { toLocalTimeString } from '@utils/timeZone'
import { useEffect, useState } from 'react'

export default function AnnouncementFields({
    channels,
    roles,
    defaultValues,
    nested,
    formData
}: {
    channels: Option[]
    roles: Option[]
    defaultValues?: GetAnnouncementProps
    nested?: boolean
    formData?: {
        titleNo?: string
        titleEn?: string
        descriptionNo?: string
        descriptionEn?: string
        publishDate?: string
        publishTime?: string
        color?: string
    }
}) {
    const { titleNo, titleEn, descriptionNo, descriptionEn, publishDate, publishTime, color } = formData || {}

    const [formValues, setFormValues] = useState({
        title_no: titleNo || defaultValues?.title?.[0] || '',
        title_en: titleEn || defaultValues?.title?.[1] || '',
        description_no: descriptionNo || defaultValues?.description?.[0] || '',
        description_en: descriptionEn || defaultValues?.description?.[1] || '',
        channel: defaultValues?.channel ?? '',
        roles: defaultValues?.roles?.join(' ') ?? '',
        embed: defaultValues?.embed ?? true,
        color: defaultValues?.color || color || '#fd8738',
        interval: defaultValues?.interval ?? '',
        time: publishDate && publishTime ? `${publishDate}T${publishTime}` : defaultValues?.time ?? new Date().toISOString(),
    })

    const [intervalError, setIntervalError] = useState<string | null>(null)

    useEffect(() => {
        if (titleNo || descriptionNo) {
            setFormValues((prev) => ({
                ...prev,
                title_no: titleNo || prev.title_no,
                title_en: titleEn || prev.title_en,
                description_no: descriptionNo || prev.description_no,
                description_en: descriptionEn || prev.description_en,
            }))
        }
    }, [titleNo, titleEn, descriptionNo, descriptionEn])

    useEffect(() => {
        if (publishDate && publishTime) {
            setFormValues((prev) => ({
                ...prev,
                time: `${publishDate}T${publishTime}`,
            }))
        }
    }, [publishDate, publishTime])

    useEffect(() => {
        if (color) {
            setFormValues((prev) => ({
                ...prev,
                color: color,
            }))
        }
    }, [color])

    useEffect(() => {
        function setLocalStorageItem(key: string, value: string) {
            localStorage.setItem(key, value)

            const event = new CustomEvent('customStorageChange', {
                detail: { key, value }
            })

            window.dispatchEvent(event)
        }

        setLocalStorageItem('title_no', formValues.title_no)
        setLocalStorageItem('title_en', formValues.title_en)
        setLocalStorageItem('description_no', formValues.description_no)
        setLocalStorageItem('description_en', formValues.description_en)
        setLocalStorageItem('channel', formValues.channel)
        setLocalStorageItem('roles', formValues.roles)
        setLocalStorageItem('embed', String(formValues.embed))
        setLocalStorageItem('color', formValues.color)
        setLocalStorageItem('interval', formValues.interval)
        setLocalStorageItem('time', formValues.time || '')

    }, [formValues])

    function example() {
        setFormValues(sampleAnnouncement)
    }

    function isValidCron(cron: string): boolean {
        const parts = cron.trim().split(/\s+/)
        if (parts.length === 5) {
            const regex = /^[\d*,/-]+$/
            return parts.every(part => regex.test(part))
        } else if (parts.length === 6) {
            const regex = /^[\d*,/-]+$/
            const first5 = parts.slice(0, 5).every(part => regex.test(part))
            const sixth = /^\/(\d+)$/.test(parts[5])
            return first5 && sixth
        }
        return false
    }

    return (
        <div className='flex flex-col relative'>
            {!nested && <div className='absolute flex flex-row gap-4 w-full justify-end -mt-13'>
                <Button
                    variant='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>}
            <div className={titleNo || titleEn ? 'hidden' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                <Input
                    name='announcement_title_no'
                    type='text'
                    label='Title (Norwegian)'
                    value={formValues.title_no}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            title_no: e.target.value,
                        })
                    }
                />
                <Input
                    name='announcement_title_en'
                    type='text'
                    label='Title (English)'
                    value={formValues.title_en}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            title_en: e.target.value,
                        })
                    }
                />
            </div>

            <div className={descriptionNo || descriptionEn ? 'hidden' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                <Textarea
                    name='announcement_description_no'
                    label='Description (Norwegian)'
                    type='markdown'
                    value={formValues.description_no}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            description_no: e.target.value,
                        })
                    }
                />
                <Textarea
                    name='announcement_description_en'
                    label='Description (English)'
                    type='markdown'
                    value={formValues.description_en}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            description_en: e.target.value,
                        })
                    }
                />
            </div>

            <Select
                name='announcement_channel'
                label='Discord channel'
                options={channels}
                value={formValues.channel || ''}
                required
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        channel: value as string,
                    })
                }
                className='col-span-2'
            />
            <Select
                name='announcement_roles'
                label='Role'
                options={roles}
                value={formValues.roles || ''}
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        roles: String(value || ''),
                    })
                }
                className='col-span-2'
            />
            <Switch
                name='announcement_embed'
                label='Embed'
                checked={formValues.embed || false}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        embed: e.target.checked,
                    })
                }
            />
            <Input
                name='announcement_color'
                type='color'
                label='Embed color'
                value={formValues.color}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        color: e.target.value,
                    })
                }
            />
            <Input
                name='announcement_interval'
                type='text'
                label='Interval (Cron)'
                value={formValues.interval}
                onChange={(e) => {
                    const value = e.target.value
                    setFormValues({
                        ...formValues,
                        interval: value,
                    })
                    if (!isValidCron(value)) {
                        setIntervalError('Invalid cron format')
                    } else {
                        setIntervalError(null)
                    }
                }}
                error={intervalError || undefined}
            />
            <div className={publishDate ? 'hidden' : ''}>
                <Input
                    name='announcement_publish_date'
                    label='Publish Date'
                    type='date'
                    value={formValues.time.split('T')[0]}
                    onChange={(e) => {
                        const date = e.target.value
                        const time =
                            toLocalTimeString(formValues.time) ??
                            '00:00'
                        setFormValues({
                            ...formValues,
                            time: `${date}T${time}`,
                        })
                    }}
                />
            </div>
            <div className={publishTime ? 'hidden' : ''}>
                <Input
                    name='announcement_publish_time'
                    label='Publish Time'
                    type='time'
                    value={toLocalTimeString(formValues.time)}
                    onChange={(e) => {
                        const time = e.target.value
                        const date =
                            formValues.time.split('T')[0] ??
                            new Date().toISOString().split('T')[0]
                        setFormValues({
                            ...formValues,
                            time: `${date}T${time}`,
                        })
                    }}
                />
            </div>
        </div>
    )
}

const sampleAnnouncement = {
    title_no: '🍹 Mocktailkurs på Login Loungen',
    title_en: '🍹 Mocktail course at the Login Lounge',
    description_no:
        `Hei <@&1143326743508308032>! Det arrangeres mocktailkurs på Login Loungen i dag kl 15.

\`\`\`ts
const a = 5
\`\`\``,
    description_en:
        `Hi <@&1143326743508308032>! There is a mocktail course at the Login Lounge today at 15.

\`\`\`ts
const a = 5
\`\`\``,
    channel: '940907390629449769',
    roles: '1143326743508308032',
    embed: true,
    color: 'fd8738',
    interval: '* * * * *',
    time: new Date().toISOString(),
}
