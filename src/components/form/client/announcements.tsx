'use client'

import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import Button from '@components/userInput/button'
import anyMandatoryFieldSet from '@utils/announce/anyMandatoryFieldSet'
import { useEffect, useState } from 'react'

export default function AnnouncementFormInputsClient({
    channels,
    defaultValues,
    preview,
    nested,
    color,
    buttonColor,
    buttonColorHighlighted,
    required: req = true
}: {
    channels: Option[]
    defaultValues?: GetAnnouncementProps
    preview?: boolean
    nested?: boolean
    color?: string
    buttonColor?: string
    buttonColorHighlighted?: string
    required?: boolean
}) {
    const [required, setRequired] = useState(req)
    const [formValues, setFormValues] = useState({
        title: defaultValues?.title ?? '',
        description: defaultValues?.description ?? '',
        channel: defaultValues?.channel ?? '',
        embed: defaultValues?.embed ?? true,
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
        setLocalStorageItem('embed', String(formValues.embed))
        setLocalStorageItem('color', formValues.color)
        setLocalStorageItem('interval', formValues.interval)
        setLocalStorageItem('time', formValues.time || '')

        if (!req && anyMandatoryFieldSet(formValues)) {
            setRequired(true)
        }

        if (!req && !anyMandatoryFieldSet(formValues)) {
            setRequired(false)
        }
    }, [formValues])

    useEffect(() => {
        if (req) {
            setRequired(true)
        }
    }, [])

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleAnnouncement)
    }

    return (
        <div className='flex flex-col gap-4 relative'>
            {/* prettier-ignore */}
            {!nested && <div className={
                `absolute flex flex-row gap-[1rem] w-full justify-end ${mt}`
            }>
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
                color={color}
                required={required}
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
                color={color}
                required={required}
                buttonColor={buttonColor}
                buttonColorHighlighted={buttonColorHighlighted}
                value={formValues.description}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description: input as string,
                    })
                }
            />
            <Select
                name='channel'
                label='Discord channel'
                options={channels}
                color={color}
                value={formValues.channel || ''}
                required={required}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        channel: input as string,
                    })
                }
                className='col-span-2'
            />
            <Switch
                name='embed'
                label='Embed'
                value={formValues.embed || false}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        embed: input,
                    })
                }
            />
            <Input
                name='color'
                type='text'
                label='Embed color'
                color={color}
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
                color={color}
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
                color={color}
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
    channel: '940907390629449769',
    embed: true,
    color: 'fd8738',
    interval: '* * * * *',
    time: '18:00',
}
