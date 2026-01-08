'use client'

import { Input, Textarea, Select, Switch, Button } from 'uibee/components'
import { toLocalTimeString } from '@utils/timeZone'
import { useEffect, useState } from 'react'

export default function AnnouncementFormInputsClient({
    channels,
    roles,
    defaultValues,
    nested,
}: {
    channels: Option[]
    roles: Option[]
    defaultValues?: GetAnnouncementProps
    nested?: boolean
}) {
    const [formValues, setFormValues] = useState({
        title: defaultValues?.title ?? '',
        description: defaultValues?.description ?? '',
        channel: defaultValues?.channel ?? '',
        roles: defaultValues?.roles?.join(' ') ?? '',
        embed: defaultValues?.embed ?? true,
        color: defaultValues?.color ?? '',
        interval: defaultValues?.interval ?? '',
        time: defaultValues?.time ?? new Date().toISOString(),
    })

    useEffect(() => {
        function setLocalStorageItem(key: string, value: string) {
            localStorage.setItem(key, value)

            const event = new CustomEvent('customStorageChange', {
                detail: { key, value }
            })

            window.dispatchEvent(event)
        }

        setLocalStorageItem('title', formValues.title)
        setLocalStorageItem('description', formValues.description)
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

    return (
        <div className='flex flex-col relative'>
            {!nested && <div className='absolute flex flex-row gap-4 w-full justify-end -mt-13'>
                <Button
                    color='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>}
            <Input
                name='title'
                type='text'
                label='Title'
                required
                value={formValues.title}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        title: e.target.value,
                    })
                }
            />
            <Textarea
                name='description'
                label='Description'
                type='markdown'
                required
                value={formValues.description}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description: e.target.value,
                    })
                }
            />
            <Select
                name='channel'
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
                name='roles'
                label='Role'
                options={roles}
                value={formValues.roles || ''}
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        roles: value as string,
                    })
                }
                className='col-span-2'
            />
            <Switch
                name='embed'
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
                name='color'
                type='text'
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
                name='interval'
                type='text'
                label='Interval'
                value={formValues.interval}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        interval: e.target.value,
                    })
                }
            />
            <Input
                name='publish_date'
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
            <Input
                name='publish_time'
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
    )
}

const sampleAnnouncement = {
    title: '🍹 Mocktailkurs på Login Loungen',
    description:
        `Hei <@&1143326743508308032>! Det arrangeres mocktailkurs på Login Loungen i dag kl 15.

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
