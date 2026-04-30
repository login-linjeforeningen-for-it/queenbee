'use client'

import Announce from '@components/announce/announce'
import Upload from '@components/image/upload'
import postImage from '@utils/api/workerbee/images/postImage'
import apiRequestClient from '@utils/api/client/request'
import { useEffect, useRef, useState } from 'react'
import { toLocalTimeString } from '@utils/timeZone'
import { toast, Button, Input, Switch, Select, Textarea } from 'uibee/components'
import config from '@config'

type PublicSignupFormMeta = {
    published_at: string
    expires_at: string
    limit: number | null
}

function parseFormsLoginSlug(url: string | null | undefined): string | null {
    if (!url || typeof url !== 'string') {
        return null
    }

    const normalizedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`

    try {
        const parsedUrl = new URL(normalizedUrl)
        if (!['forms.login.no'].includes(parsedUrl.hostname)) {
            return null
        }

        const match = parsedUrl.pathname.match(/^\/f\/([a-z0-9-_]+)\/?$/)
        return match?.[1] || null
    } catch {
        return null
    }
}

function toInputDateString(date: string): string {
    const isoDateMatch = date.match(/^(\d{4}-\d{2}-\d{2})T/)
    if (isoDateMatch?.[1]) {
        return isoDateMatch[1]
    }

    const localDate = new Date(date)
    if (Number.isNaN(localDate.getTime())) {
        return ''
    }

    return localDate.toISOString().split('T')[0]
}

function toInputTimeString(date: string): string {
    const isoTimeMatch = date.match(/T(\d{2}:\d{2})/)
    if (isoTimeMatch?.[1]) {
        return isoTimeMatch[1]
    }

    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) {
        return ''
    }

    return parsedDate.toISOString().slice(11, 16)
}

export default function EventFields({
    defaultValues,
    defaultImages,
    categories,
    organizations,
    audiences,
    timeTypes,
    rules,
    locations,
    channels,
    roles,
    type
}: {
    defaultValues?: GetEventProps
    defaultImages: Option[]
    categories: (OptionsProps & { color: string })[]
    audiences: OptionsProps[]
    organizations: Option[]
    timeTypes: OptionsProps[]
    rules: Option[]
    locations: (Option & { nameNo: string, nameEn: string })[]
    channels: Channel[]
    roles: Role[]
    type: 'create' | 'update'
}) {
    const [images, setImages] = useState<Option[]>(defaultImages)
    const [lastFetchedSignupSlug, setLastFetchedSignupSlug] = useState<string | null>(null)
    const latestSignupRequest = useRef(0)
    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.name_no || '',
        name_en: defaultValues?.name_en || '',
        informational_no: defaultValues?.informational_no || '',
        informational_en: defaultValues?.informational_en || '',
        description_no: defaultValues?.description_no || '',
        description_en: defaultValues?.description_en || '',
        category: defaultValues?.category?.id,
        organization: defaultValues?.organization?.id,
        rule: defaultValues?.rule?.id,
        location: defaultValues?.location?.id,
        audience_id: defaultValues?.audience?.id,
        time_type: defaultValues?.time_type || 'default' as time_type,
        start_date: defaultValues?.time_start.split('T')[0],
        end_date: defaultValues?.time_end.split('T')[0],
        start_time: toLocalTimeString(defaultValues?.time_start),
        end_time: toLocalTimeString(defaultValues?.time_end),
        publish_date: defaultValues?.time_publish.split('T')[0],
        default_start_time: toLocalTimeString(defaultValues?.time_start),
        default_end_time: toLocalTimeString(defaultValues?.time_end),
        no_end_start_time: toLocalTimeString(defaultValues?.time_start),
        whole_day: '' as string,
        tbd: '' as string,
        capacity: defaultValues?.capacity,
        deadline_date: defaultValues?.time_signup_deadline?.split('T')[0],
        deadline_time: toLocalTimeString(defaultValues?.time_signup_deadline ?? undefined),
        image_banner: defaultValues?.image_banner,
        image_small: defaultValues?.image_small,
        publish_time: toLocalTimeString(defaultValues?.time_publish),
        highlight: defaultValues?.highlight,
        link_signup: defaultValues?.link_signup,
        release_date: defaultValues?.time_signup_release ? defaultValues.time_signup_release.split('T')[0] : '',
        release_time: toLocalTimeString(defaultValues?.time_signup_release ?? undefined),
        link_facebook: defaultValues?.link_facebook,
        link_discord: defaultValues?.link_discord,
        link_stream: defaultValues?.link_stream,
        repeat_type: '',
        repeat_until: ''
    })

    const signupSlug = parseFormsLoginSlug(formValues.link_signup)

    const hasSignupLink = !!formValues.link_signup && formValues.link_signup.trim() !== ''
    const hasReleaseDate = !!formValues.release_date && formValues.release_date.trim() !== ''
    const hasReleaseTime = !!formValues.release_time && formValues.release_time.trim() !== ''
    const hasDeadlineDate = !!formValues.deadline_date && formValues.deadline_date.trim() !== ''
    const hasDeadlineTime = !!formValues.deadline_time && formValues.deadline_time.trim() !== ''

    const shouldRequireSignupLink = hasReleaseDate || hasReleaseTime || hasDeadlineDate || hasDeadlineTime
    const shouldRequireSignupFields = hasSignupLink || hasReleaseDate || hasReleaseTime || hasDeadlineDate || hasDeadlineTime

    useEffect(() => {
        if (!signupSlug) {
            setLastFetchedSignupSlug(null)
            return
        }

        if (signupSlug === lastFetchedSignupSlug) {
            return
        }

        const timeoutHandle = setTimeout(async () => {
            const requestId = latestSignupRequest.current + 1
            latestSignupRequest.current = requestId

            try {
                const formMeta = await apiRequestClient<PublicSignupFormMeta>({
                    method: 'GET',
                    path: `api/forms/${encodeURIComponent(signupSlug)}`
                })

                if (typeof formMeta.published_at !== 'string' || typeof formMeta.expires_at !== 'string') {
                    throw new Error('forms.login.no returned incomplete signup metadata')
                }

                if (latestSignupRequest.current !== requestId) {
                    return
                }

                setFormValues((currentValues) => ({
                    ...currentValues,
                    release_date: toInputDateString(formMeta.published_at),
                    release_time: toInputTimeString(formMeta.published_at),
                    deadline_date: toInputDateString(formMeta.expires_at),
                    deadline_time: toInputTimeString(formMeta.expires_at),
                    capacity: formMeta.limit,
                }))

                toast.success('Signup release and deadline were auto-filled from forms.login.no.')
            } catch {
                if (latestSignupRequest.current === requestId) {
                    toast.error('Could not fetch signup details from forms.login.no.')
                }
            } finally {
                if (latestSignupRequest.current === requestId) {
                    setLastFetchedSignupSlug(signupSlug)
                }
            }
        }, 500)

        return () => clearTimeout(timeoutHandle)
    }, [lastFetchedSignupSlug, signupSlug])

    function retrySignupFetch() {
        if (!signupSlug) {
            return
        }

        setLastFetchedSignupSlug(null)
    }

    function example() {
        setFormValues(sampleEvent)
    }

    async function handleFile(file: File): Promise<void> {
        toast.info(`Uploading ${file.name}...`, 6000)

        try {
            const result = await postImage('events', file)
            if (typeof result === 'string') {
                toast.error(`Image upload failed: ${result}`, 8000)
                return
            }

            toast.success(`Uploaded ${result.name}. It is now available in both image selectors.`, 8000)
            const existingImage = images.find(img => img.value === result.name)
            if (!existingImage) {
                const uploadedImage = {
                    label: result.name,
                    value: result.name,
                    image: `${config.url.cdn}/${result.image}`,
                }

                setImages((currentImages) => [
                    ...currentImages,
                    uploadedImage
                ])

                setFormValues((currentValues) => ({
                    ...currentValues,
                    image_banner: currentValues.image_banner || result.name,
                    image_small: currentValues.image_small || result.name,
                }))
            } else {
                setImages((currentImages) => currentImages.map((image) =>
                    image.value === result.name
                        ? {
                            ...image,
                            image: `${config.url.cdn}/${result.image}`,
                        }
                        : image
                ))
            }
        } catch (error) {
            toast.error(
                `Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                8000
            )
        }

    }

    function formatDate(dateString: string) {
        const d = new Date(dateString)
        const day = d.getDate().toString().padStart(2, '0')
        const month = (d.getMonth() + 1).toString().padStart(2, '0')
        const year = d.getFullYear()
        return `${day}.${month}.${year}`
    }

    const locationNameNo = formValues.location ? `**Hvor:** ${locations.find(loc => loc.value === formValues.location)?.nameNo}\n` : ''
    const locationNameEn = formValues.location ? `**Where:** ${locations.find(loc => loc.value === formValues.location)?.nameEn}\n` : ''

    const timeInfoNo = formValues.start_date && formValues.end_date ?
        `**Når:** ${formatDate(formValues.start_date)} kl. ${formValues.start_time} - ${formValues.end_time}` +
        `${formValues.end_date === formValues.start_date ? '' : ` (${formatDate(formValues.end_date)})`}\n` : ''
    const timeInfoEn = formValues.start_date && formValues.end_date ?
        `**When:** ${formatDate(formValues.start_date)} at ${formValues.start_time} - ${formValues.end_time}` +
        `${formValues.end_date === formValues.start_date ? '' : ` (${formatDate(formValues.end_date)})`}\n` : ''

    const announcementDescriptionNo = `${formValues.description_no}\n\n${locationNameNo}${timeInfoNo}`
    const announcementDescriptionEn = `${formValues.description_en}\n\n${locationNameEn}${timeInfoEn}`

    return (
        <div className='md:grid md:grid-cols-2 gap-x-8 md:pt-4 relative'>
            <div className='absolute grid md:flex! flex-row gap-4 w-full justify-end -mt-13'>
                <Button
                    variant='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>
            <Input
                name='name_no'
                type='text'
                label='Name (Norwegian)'
                value={formValues.name_no}
                onChange={(e) => setFormValues({
                    ...formValues,
                    name_no: e.target.value,
                })}
                required
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                value={formValues.name_en}
                onChange={(e) => setFormValues({
                    ...formValues,
                    name_en: e.target.value,
                })}
                required
            />
            <Input
                name='informational_no'
                type='text'
                label='Informational (Norwegian)'
                value={formValues.informational_no}
                onChange={(e) => setFormValues({
                    ...formValues,
                    informational_no: e.target.value,
                })}
            />
            <Input
                name='informational_en'
                type='text'
                label='Informational (English)'
                value={formValues.informational_en}
                onChange={(e) => setFormValues({
                    ...formValues,
                    informational_en: e.target.value,
                })}
            />
            <Textarea
                name='description_no'
                label='Description (Norwegian)'
                type='markdown'
                value={formValues.description_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_no: e.target.value,
                    })
                }
                required
            />
            <Textarea
                name='description_en'
                label='Description (English)'
                type='markdown'
                value={formValues.description_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_en: e.target.value,
                    })
                }
                required
            />
            <div className='flex flex-col'>
                <Select
                    name='category'
                    label='Category'
                    options={categories}
                    value={formValues.category || ''}
                    onChange={(value) =>
                        setFormValues({
                            ...formValues,
                            category: Number(value),
                        })
                    }
                    required
                />
                <Select
                    name='organization'
                    label='Organization'
                    options={organizations}
                    value={formValues.organization || ''}
                    onChange={(value) =>
                        setFormValues({
                            ...formValues,
                            organization: Number(value),
                        })
                    }
                />
                <Select
                    name='rule'
                    label='Rule'
                    options={rules}
                    value={formValues.rule || ''}
                    onChange={(value) =>
                        setFormValues({
                            ...formValues,
                            rule: Number(value),
                        })
                    }
                />
                <Select
                    name='location'
                    label='Location'
                    options={locations}
                    value={formValues.location || ''}
                    onChange={(value) =>
                        setFormValues({
                            ...formValues,
                            location: Number(value),
                        })
                    }
                />
                <Select
                    name='audience_id'
                    label='Audience'
                    options={audiences}
                    value={formValues.audience_id || ''}
                    onChange={(value) =>
                        setFormValues({
                            ...formValues,
                            audience_id: Number(value),
                        })
                    }
                />
            </div>
            <div className='flex flex-col sm:grid! sm:grid-cols-2 gap-x-4'>
                <Select
                    name='time_type'
                    label='Time Type'
                    options={timeTypes}
                    value={formValues.time_type || ''}
                    onChange={(value) =>
                        setFormValues({
                            ...formValues,
                            time_type: value as time_type,
                        })
                    }
                    required
                    className='col-span-2'
                />
                <Input
                    type='date'
                    name='start_date'
                    label='Start Date'
                    value={formValues.start_date || ''}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            start_date: e.target.value,
                        })
                    }
                    required
                />
                {!formValues.time_type && (
                    <Input
                        type='time'
                        name='start_time'
                        label='Start Time'
                        value={formValues.start_time || ''}
                        onChange={(e) => setFormValues({
                            ...formValues,
                            start_time: e.target.value,
                        })}
                        required />
                )}
                {formValues.time_type === 'default' && (
                    <Input
                        type='time'
                        name='start_time'
                        label='Start Time'
                        value={
                            formValues.default_start_time || ''
                        }
                        onChange={(input) =>
                            setFormValues({
                                ...formValues,
                                default_start_time: input.target.value,
                            })
                        }
                        required
                    />
                )}
                {formValues.time_type === 'no_end' && (
                    <Input
                        type='time'
                        name='start_time'
                        label='Start Time'
                        value={
                            formValues.no_end_start_time || ''
                        }
                        onChange={(input) =>
                            setFormValues({
                                ...formValues,
                                no_end_start_time: input.target.value,
                            })
                        }
                        required
                    />
                )}
                {(formValues.time_type === 'whole_day' || formValues.time_type === 'tbd') && (
                    <Input
                        type='time'
                        name='start_time'
                        label='Start Time'
                        value='00:00'
                        disabled
                    />
                )}
                <Input
                    type='date'
                    name='end_date'
                    label='End Date'
                    value={formValues.end_date || ''}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            end_date: e.target.value,
                        })
                    }
                    required
                />
                {!formValues.time_type && (
                    <Input
                        type='time'
                        name='end_time'
                        label='End Time'
                        value={formValues.end_time || ''}
                        onChange={(e) => setFormValues({
                            ...formValues,
                            end_time: e.target.value,
                        })}
                        required
                    />
                )}
                {formValues.time_type === 'default' && (
                    <Input
                        type='time'
                        name='end_time'
                        label='End Time'
                        value={
                            formValues.default_end_time || ''
                        }
                        onChange={(input) =>
                            setFormValues({
                                ...formValues,
                                default_end_time: input.target.value,
                            })
                        }
                        required
                    />
                )}
                {formValues.time_type === 'no_end' && (
                    <Input
                        type='time'
                        name='end_time'
                        label='End Time'
                        value='23:00'
                        disabled
                    />
                )}
                {(formValues.time_type === 'whole_day' || formValues.time_type === 'tbd') && (
                    <Input
                        type='time'
                        name='end_time'
                        label='End Time'
                        value='23:59'
                        disabled
                    />
                )}
                <Input
                    type='date'
                    name='publish_date'
                    label='Publish Date'
                    value={formValues.publish_date || ''}
                    onChange={(input) =>
                        setFormValues({
                            ...formValues,
                            publish_date: input.target.value,
                        })
                    }
                    required
                />
                <Input
                    type='time'
                    name='publish_time'
                    label='Publish Time'
                    value={formValues.publish_time || ''}
                    onChange={(input) =>
                        setFormValues({
                            ...formValues,
                            publish_time: input.target.value,
                        })
                    }
                    required
                />
                <Switch
                    name='highlight'
                    label='Highlight'
                    checked={formValues.highlight || false}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            highlight: e.target.checked,
                        })
                    }
                    className='col-span-2 md:h-24'
                />
            </div>
            {type === 'create' &&
                <>
                    <h1 className='text-xl pt-10 pb-4 col-span-2'>Repeat</h1>
                    <Select
                        name='repeat_type'
                        options={[
                            { label: 'Weekly', value: 'weekly' },
                            { label: 'Biweekly', value: 'biweekly' },
                        ]}
                        value={formValues.repeat_type || ''}
                        onChange={(value) =>
                            setFormValues({
                                ...formValues,
                                repeat_type: value as string,
                            })
                        }
                        className='col-span-2'
                    />
                    {formValues.repeat_type &&
                        <Input
                            type='date'
                            name='repeat_until'
                            label='Repeat Until'
                            value={formValues.repeat_until || ''}
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    repeat_until: e.target.value as string,
                                })
                            }
                            className='col-span-2'
                            required
                        />
                    }
                </>
            }
            <h1 className='text-xl pt-10 pb-4 col-span-2'>Signup</h1>
            <Input
                name='link_signup'
                type='text'
                label='Signup Link'
                value={formValues.link_signup ?? ''}
                onChange={(e) => setFormValues({
                    ...formValues,
                    link_signup: e.target.value,
                })}
                onBlur={retrySignupFetch}
                required={shouldRequireSignupLink}
            />
            <div className='flex flex-col sm:flex-row! gap-x-4'>
                <Input
                    type='date'
                    name='release_date'
                    label='Release Date'
                    value={formValues.release_date || ''}
                    onChange={(input) =>
                        setFormValues({
                            ...formValues,
                            release_date: input.target.value,
                        })
                    }
                    required={shouldRequireSignupFields}
                />
                <Input
                    type='time'
                    name='release_time'
                    label='Release Time'
                    value={formValues.release_time || ''}
                    onChange={(input) =>
                        setFormValues({
                            ...formValues,
                            release_time: input.target.value,
                        })
                    }
                    required={shouldRequireSignupFields}
                />
            </div>
            <Input
                name='capacity'
                type='number'
                label='Capacity'
                value={formValues.capacity ?? ''}
                onChange={(e) => setFormValues({
                    ...formValues,
                    capacity: Number(e.target.value),
                })}
            />
            <div className='flex flex-col sm:flex-row! gap-x-4'>
                <Input
                    type='date'
                    name='deadline_date'
                    label='Deadline Date'
                    value={formValues.deadline_date || ''}
                    onChange={(input) =>
                        setFormValues({
                            ...formValues,
                            deadline_date: input.target.value,
                        })
                    }
                    required={shouldRequireSignupFields}
                />
                <Input
                    type='time'
                    name='deadline_time'
                    label='Deadline Time'
                    value={formValues.deadline_time || ''}
                    onChange={(input) =>
                        setFormValues({
                            ...formValues,
                            deadline_time: input.target.value,
                        })
                    }
                    required={shouldRequireSignupFields}
                />
            </div>
            <h1 className='text-xl pt-10 pb-4 col-span-2'>Image</h1>
            <Upload
                handleFile={handleFile}
                showTag={true}
            />
            <Select
                name='image_banner'
                label='Banner Image'
                options={images}
                value={formValues.image_banner || ''}
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        image_banner: value as string,
                    })
                }
                className='col-span-2'
            />
            <Select
                name='image_small'
                label='Small Image'
                options={images}
                value={formValues.image_small || ''}
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        image_small: value as string,
                    })
                }
                className='col-span-2'
            />
            <h1 className='text-xl pt-10 pb-4 col-span-2'>Social Links</h1>
            <Input
                name='link_facebook'
                type='text'
                label='Facebook Link'
                value={formValues.link_facebook ?? ''}
                onChange={(e) => setFormValues({
                    ...formValues,
                    link_facebook: e.target.value,
                })}
                className='col-span-2'
            />
            <Input
                name='link_discord'
                type='text'
                label='Discord Link'
                value={formValues.link_discord ?? ''}
                onChange={(e) => setFormValues({
                    ...formValues,
                    link_discord: e.target.value,
                })}
                className='col-span-2'
            />
            <Input
                name='link_stream'
                type='text'
                label='Stream Link'
                value={formValues.link_stream ?? ''}
                onChange={(e) => setFormValues({
                    ...formValues,
                    link_stream: e.target.value,
                })}
                className='col-span-2'
            />
            <Announce
                channels={channels}
                roles={roles}
                formData={{
                    titleNo: formValues.name_no,
                    titleEn: formValues.name_en,
                    descriptionNo: announcementDescriptionNo,
                    descriptionEn: announcementDescriptionEn,
                    publishDate: formValues.publish_date,
                    publishTime: formValues.publish_time,
                    color: categories.find(category => category.value === formValues.category)?.color || undefined,
                }}
            />
        </div>
    )
}

const today = new Date()

const sampleEvent = {
    name_no: '🍽️ Studentlunsj med Login',
    name_en: '🍽️ Student Lunch with Login',
    informational_no: 'Bli kjent med medstudenter og Login over lunsj!',
    informational_en:
        'Meet fellow students and get to know Login better over lunch!',
    description_no: `🎉 Velkommen til en sosial studentlunsj hos Login i Gjøvik!
- Gratis mat og drikke  
- Møt andre studenter på studiet  
- Få informasjon om kommende arrangementer og aktiviteter`,
    description_en: `🎉 Welcome to a social student lunch with Login in Gjøvik!  
- Free food and drinks  
- Meet fellow students in the study program  
- Learn about upcoming events and activities`,
    category: 1,
    organization: 1,
    rule: 1,
    location: 1,
    audience_id: 1,
    time_type: 'default' as time_type,
    start_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '19:00',
    default_start_time: '09:00',
    default_end_time: '19:00',
    no_end_start_time: '09:00',
    publish_date: today.toISOString().split('T')[0],
    publish_time: '04:00',
    whole_day: 'false',
    tbd: 'false',
    capacity: 50,
    release_date: today.toISOString().split('T')[0],
    release_time: '12:00',
    deadline_date: today.toISOString().split('T')[0],
    deadline_time: '20:00',
    image_banner: '',
    image_small: '',
    highlight: true,
    link_signup: 'https://login.no/signup/studentlunsj',
    link_facebook: 'https://www.facebook.com/loginlinjeforeningen/events/',
    link_discord: 'https://discord.gg/login',
    link_stream: 'https://login.no/stream',
    repeat_type: '',
    repeat_until: ''
}
