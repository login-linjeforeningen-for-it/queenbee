'use client'

import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Button from '@components/userInput/button'
import { useEffect, useState } from 'react'

export default function AnnouncementFormInputsClient({
    defaultValues,
    preview,
}: {
    defaultValues?: GetAnnouncementProps
    preview?: boolean
}) {
    const [formValues, setFormValues] = useState({
        title: defaultValues?.title ?? '',
        description: defaultValues?.description ?? '',
        channel: defaultValues?.channel ?? '',
        embed: defaultValues?.embed ?? '',
        color: defaultValues?.color ?? '',
        interval: defaultValues?.interval ?? '',
        time: defaultValues?.time ?? null,
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
        setLocalStorageItem('embed', formValues.embed)
        setLocalStorageItem('color', formValues.color)
        setLocalStorageItem('interval', formValues.interval)
        setLocalStorageItem('time', formValues.time || '')
    }, [formValues])

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleAnnouncement)
    }

    return (
        <div className='flex flex-col gap-4 relative'>
            {/* prettier-ignore */}
            <div className={
                `absolute flex flex-row gap-[1rem] w-full justify-end ${mt}`
            }>
                <Button
                    color='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>
            <Input
                name='title'
                type='text'
                label='Name (Norwegian)'
                required
                value={formValues.title}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        title: input as string,
                    })
                }
            />
            <Markdown
                name='description'
                label='Description'
                required
                value={formValues.description}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description: input as string,
                    })
                }
            />
            <Input
                name='channel'
                type='text'
                label='Discord Channel'
                required
                value={formValues.channel}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        channel: input as string,
                    })
                }
            />
            <Input
                name='color'
                type='text'
                label='Embed color'
                required
                value={formValues.color}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        color: input as string,
                    })
                }
            />
            <Input
                name='interval'
                type='text'
                label='Interval'
                value={formValues.interval}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        interval: input as string,
                    })
                }
            />
            <Input
                name='time'
                type='text'
                label='Time'
                value={formValues.time || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        time: input as string,
                    })
                }
            />
        </div>
    )
}

const sampleAnnouncement = {
    title: '🍹 Mocktailkurs på Login Loungen',
    description:
        'Hei @<Login-Verv>! Det arrangeres mocktailkurs på Login ' +
        'Loungen i dag kl 15.',
    channel: 'Arrangementer',
    embed: 'true',
    color: 'fd8738',
    interval: '* * * * *',
    time: '18:00',
}
