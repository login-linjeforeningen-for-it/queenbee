'use client'

import DateInput from '@components/inputs/date'
import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import TimeInput from '@components/inputs/time'
import Announce from '@components/announce/announce'
import Button from '@components/button/button'
import { useState } from 'react'
import { toLocalTimeString } from '@utils/timeZone'
import Upload from '@components/inputs/upload'
import { uploadImage } from '@utils/api'
import { toast } from 'sonner'

export function EventFormInputsClient({
    defaultValues,
    defaultImages,
    categories,
    organizations,
    audiences,
    timeTypes,
    rules,
    locations,
    preview,
    channels,
    roles,
    type
}: {
    defaultValues?: GetEventProps
    defaultImages: Option[]
    categories: OptionsProps[]
    audiences: OptionsProps[]
    organizations: Option[]
    timeTypes: OptionsProps[]
    rules: Option[]
    locations: Option[]
    preview?: boolean
    channels: Channel[]
    roles: Role[]
    type: 'create' | 'update'
}) {
    const [images, setImages] = useState<Option[]>(defaultImages)
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
        time_type: defaultValues?.time_type,
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
        isFull: defaultValues?.is_full,
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

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleEvent)
    }

    return (
        <div className='grid grid-cols-2 gap-y-4 gap-x-8 pt-10 relative'>
            <div
                className={
                    `absolute flex flex-row gap-4 w-full ${mt} ` +
                    'justify-end'
                }
            >
                <Button
                    color='secondary'
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
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        name_no: input.toString(),
                    })
                }
                required
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                value={formValues.name_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        name_en: input.toString(),
                    })
                }
                required
            />
            <Input
                name='informational_no'
                type='text'
                label='Informational (Norwegian)'
                value={formValues.informational_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        informational_no: input.toString(),
                    })
                }
            />
            <Input
                name='informational_en'
                type='text'
                label='Informational (English)'
                value={formValues.informational_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        informational_en: input.toString(),
                    })
                }
            />
            <Markdown
                name='description_no'
                label='Description (Norwegian)'
                value={formValues.description_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_no: input.toString(),
                    })
                }
                required
            />
            <Markdown
                name='description_en'
                label='Description (English)'
                value={formValues.description_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_en: input.toString(),
                    })
                }
                required
            />
            <div className='flex flex-col gap-y-4'>
                <Select
                    name='category'
                    label='Category'
                    options={categories}
                    value={formValues.category || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            category: Number(input),
                        })
                    }
                    required
                />
                <Select
                    name='organization'
                    label='Organization'
                    options={organizations}
                    value={formValues.organization || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            organization: Number(input),
                        })
                    }
                />
                <Select
                    name='rule'
                    label='Rule'
                    options={rules}
                    value={formValues.rule || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            rule: Number(input),
                        })
                    }
                />
                <Select
                    name='location'
                    label='Location'
                    options={locations}
                    value={formValues.location || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            location: Number(input),
                        })
                    }
                />
                <Select
                    name='audience_id'
                    label='Audience'
                    options={audiences}
                    value={formValues.audience_id || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            audience_id: Number(input),
                        })
                    }
                />
            </div>
            <Select
                name='time_type'
                label='Time Type'
                options={timeTypes}
                value={formValues.time_type || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        time_type: input as time_type,
                    })
                }
                required
            >
                <div className='grid grid-cols-2 gap-4 pt-4'>
                    <DateInput
                        name='start_date'
                        label='Start Date'
                        value={formValues.start_date || ''}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                start_date: input,
                            })
                        }
                        required
                    />
                    <DateInput
                        name='end_date'
                        label='End Date'
                        value={formValues.end_date || ''}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                end_date: input,
                            })
                        }
                        className='row-start-2'
                        required
                    />
                    {!formValues.time_type && <>
                        <TimeInput
                            name='start_time'
                            label='Start Time'
                            value={formValues.start_time || ''}
                            setValue={(input) => setFormValues({
                                ...formValues,
                                start_time: input,
                            })}
                            required /><TimeInput
                            name='end_time'
                            label='End Time'
                            value={formValues.end_time || ''}
                            setValue={(input) => setFormValues({
                                ...formValues,
                                end_time: input,
                            })}
                            required />
                    </>
                    }
                    {formValues.time_type === 'default' && <>
                        <TimeInput
                            name='start_time'
                            label='Start Time'
                            value={
                                formValues.default_start_time || ''
                            }
                            setValue={(input) =>
                                setFormValues({
                                    ...formValues,
                                    default_start_time: input,
                                })
                            }
                            required
                        />
                        <TimeInput
                            name='end_time'
                            label='End Time'
                            value={
                                formValues.default_end_time || ''
                            }
                            setValue={(input) =>
                                setFormValues({
                                    ...formValues,
                                    default_end_time: input,
                                })
                            }
                            required
                        />
                    </>
                    }
                    {formValues.time_type === 'no_end' && <>
                        <TimeInput
                            name='start_time'
                            label='Start Time'
                            value={
                                formValues.no_end_start_time || ''
                            }
                            setValue={(input) =>
                                setFormValues({
                                    ...formValues,
                                    no_end_start_time: input,
                                })
                            }
                            required
                        />
                        <TimeInput
                            name='end_time'
                            label='End Time'
                            value='23:00'
                            setValue={() => {}}
                            disabled
                        />
                    </>
                    }
                    {formValues.time_type === 'whole_day' && <>
                        <TimeInput
                            name='start_time'
                            label='Start Time'
                            setValue={() => {}}
                            value='00:00'
                            disabled
                        />
                        <TimeInput
                            name='end_time'
                            label='End Time'
                            value='23:59'
                            setValue={() => {}}
                            disabled
                        />
                    </>
                    }
                    {formValues.time_type === 'tbd' && <>
                        <TimeInput
                            name='start_time'
                            label='Start Time'
                            value='00:00'
                            setValue={() => {}}
                            disabled
                        />
                        <TimeInput
                            name='end_time'
                            label='End Time'
                            value='23:59'
                            setValue={() => {}}
                            disabled
                        />
                    </>
                    }
                    <DateInput
                        name='publish_date'
                        label='Publish Date'
                        value={formValues.publish_date || ''}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                publish_date: input,
                            })
                        }
                        required
                    />
                    <TimeInput
                        name='publish_time'
                        label='Publish Time'
                        value={formValues.publish_time || ''}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                publish_time: input,
                            })
                        }
                        required
                    />
                    <Switch
                        name='highlight'
                        label='Highlight'
                        value={formValues.highlight || false}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                highlight: input,
                            })
                        }
                        className='col-span-2 h-12'
                    />
                </div>
            </Select>
            {type === 'create' &&
                <>
                    <h1 className='text-xl pt-10 col-span-2'>Repeat</h1>
                    <Select
                        name='repeat_type'
                        label='Repeat Type'
                        options={[
                            { label: 'Weekly', value: 'weekly' },
                            { label: 'Biweekly', value: 'biweekly' },
                        ]}
                        value={formValues.repeat_type || ''}
                        setValue={(input) =>
                            setFormValues({
                                ...formValues,
                                repeat_type: input as string,
                            })
                        }
                        className='col-span-2'
                    />
                    {formValues.repeat_type &&
                        <DateInput
                            name='repeat_until'
                            label='Repeat Until'
                            value={formValues.repeat_until || ''}
                            setValue={(input) =>
                                setFormValues({
                                    ...formValues,
                                    repeat_until: input as string,
                                })
                            }
                            className='col-span-2'
                            required
                        />
                    }
                </>
            }
            <h1 className='text-xl pt-10 col-span-2'>Signup</h1>
            <Input
                name='link_signup'
                type='text'
                label='Signup Link'
                value={formValues.link_signup ?? ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        link_signup: input as string,
                    })
                }
                required = {
                    formValues.release_date !== '' && formValues.release_date !== undefined ||
                    formValues.release_time !== '' && formValues.release_time !== undefined ||
                    formValues.deadline_date !== '' && formValues.deadline_date !== undefined ||
                    formValues.deadline_time !== '' && formValues.deadline_time !== undefined
                }
            />
            <div className='flex flex-row gap-x-4'>
                <DateInput
                    name='release_date'
                    label='Release Date'
                    value={formValues.release_date || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            release_date: input,
                        })
                    }
                    required = {
                        formValues.link_signup !== '' && formValues.link_signup !== undefined ||
                        formValues.release_time !== '' && formValues.release_time !== undefined ||
                        formValues.deadline_date !== '' && formValues.deadline_date !== undefined ||
                        formValues.deadline_time !== '' && formValues.deadline_time !== undefined
                    }
                />
                <TimeInput
                    name='release_time'
                    label='Release Time'
                    value={formValues.release_time || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            release_time: input,
                        })
                    }
                    required = {
                        formValues.link_signup !== '' && formValues.link_signup !== undefined ||
                        formValues.release_date !== '' && formValues.release_date !== undefined ||
                        formValues.deadline_date !== '' && formValues.deadline_date !== undefined ||
                        formValues.deadline_time !== '' && formValues.deadline_time !== undefined
                    }
                />
            </div>
            <Input
                name='capacity'
                type='number'
                label='Capacity'
                value={formValues.capacity ?? ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        capacity: Number(input),
                    })
                }
            />
            <div className='flex flex-row gap-x-4'>
                <DateInput
                    name='deadline_date'
                    label='Deadline Date'
                    value={formValues.deadline_date || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            deadline_date: input,
                        })
                    }
                    required = {
                        formValues.link_signup !== '' && formValues.link_signup !== undefined ||
                        formValues.release_time !== '' && formValues.release_time !== undefined ||
                        formValues.release_date !== '' && formValues.release_date !== undefined ||
                        formValues.deadline_time !== '' && formValues.deadline_time !== undefined
                    }
                />
                <TimeInput
                    name='deadline_time'
                    label='Deadline Time'
                    value={formValues.deadline_time || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            deadline_time: input,
                        })
                    }
                    required = {
                        formValues.link_signup !== '' && formValues.link_signup !== undefined ||
                        formValues.release_time !== '' && formValues.release_time !== undefined ||
                        formValues.release_date !== '' && formValues.release_date !== undefined ||
                        formValues.deadline_date !== '' && formValues.deadline_date !== undefined
                    }
                />
            </div>
            <Switch
                name='isFull'
                label='Is Full'
                value={formValues.isFull || false}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        isFull: input as boolean,
                    })
                }
            />
            <h1 className='text-xl pt-10 col-span-2'>Image</h1>
            <Upload
                showSwitch
                handleFile={async function (file: File): Promise<void> {
                    const result = await uploadImage('events', file)
                    if (result.status >= 200 && result.status < 300) {
                        toast.success('Image uploaded successfully')
                        const existingImage = images.find(img => img.value === result.data)
                        if (!existingImage) {
                            setImages([
                                ...images,
                                {
                                    label: result.data,
                                    value: result.data,
                                    image: `img/jobs/${result.data}`,
                                }
                            ])
                        }
                    } else {
                        toast.error('Error uploading image')
                    }
                }}
            />
            <Select
                name='image_banner'
                label='Banner Image'
                options={images}
                value={formValues.image_banner || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        image_banner: input as string,
                    })
                }
                className='col-span-2'
            />
            <Select
                name='image_small'
                label='Small Image'
                options={images}
                value={formValues.image_small || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        image_small: input as string,
                    })
                }
                className='col-span-2'
            />
            <h1 className='text-xl pt-10 col-span-2'>Social Links</h1>
            <Input
                name='link_facebook'
                type='text'
                label='Facebook Link'
                value={formValues.link_facebook ?? ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        link_facebook: input as string,
                    })
                }
                className='col-span-2'
            />
            <Input
                name='link_discord'
                type='text'
                label='Discord Link'
                value={formValues.link_discord ?? ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        link_discord: input as string,
                    })
                }
                className='col-span-2'
            />
            <Input
                name='link_stream'
                type='text'
                label='Stream Link'
                value={formValues.link_stream ?? ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        link_stream: input as string,
                    })
                }
                className='col-span-2'
            />
            <Announce channels={channels} roles={roles} />
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
    isFull: false,
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
