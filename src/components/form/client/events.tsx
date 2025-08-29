'use client'

import DateInput from '@components/inputs/date'
import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import TimeInput from '@components/inputs/time'
import Announce from '@components/announce/announce'
import Button from '@components/userInput/button'
import { useState } from 'react'

export function EventFormInputsClient({
    defaultValues,
    bannerImages,
    smallImages,
    categories,
    organizations,
    audiences,
    timeTypes,
    rules,
    locations,
    preview
}: {
    defaultValues?: GetEventProps
    bannerImages: Option[]
    smallImages: Option[]
    categories: Option[]
    audiences: Option[]
    organizations: Option[]
    timeTypes: Option[]
    rules: Option[]
    locations: Option[]
    preview?: boolean
}) {
    const defaultOrganization =
        Array.isArray(defaultValues?.organizations) &&
        defaultValues.organizations.length > 0
            ? defaultValues.organizations[0].shortname
            : undefined

    const defaultAudience =
        Array.isArray(defaultValues?.audiences) &&
        defaultValues.audiences.length > 0
            ? defaultValues.audiences[0].id
            : undefined

    const defaultStartTime = defaultValues?.event.time_start
        .split('T')[1]
        ?.slice(0, 5)

    const defaultEndTime = defaultValues?.event.time_end
        .split('T')[1]
        ?.slice(0, 5)

    const defaultDeadlineTime = defaultValues?.event.time_signup_deadline
        .split('T')[1]
        ?.slice(0, 5)

    const defaultPublishTime = defaultValues?.event.time_publish
        .split('T')[1]
        ?.slice(0, 5)

    const defaultReleaseTime = defaultValues?.event.time_signup_release
        .split('T')[1]
        ?.slice(0, 5)

    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.event.name_no || '',
        name_en: defaultValues?.event.name_en || '',
        informational_no: defaultValues?.event.informational_no || '',
        informational_en: defaultValues?.event.informational_en || '',
        description_no: defaultValues?.event.description_no || '',
        description_en: defaultValues?.event.description_en || '',
        category: defaultValues?.event.category,
        organization: defaultOrganization,
        rule: defaultValues?.event.rule,
        location: defaultValues?.event.location,
        audiences: defaultAudience,
        time_type: defaultValues?.event.time_type,
        start_date: defaultValues?.event.time_start.split('T')[0],
        end_date: defaultValues?.event.time_end.split('T')[0],
        start_time: defaultStartTime,
        end_time: defaultEndTime,
        publish_date: defaultValues?.event.time_publish.split('T')[0],
        default_start_time: defaultStartTime,
        default_end_time: defaultEndTime,
        no_end_start_time: defaultStartTime,
        whole_day: '' as string,
        tbd: '' as string,
        capacity: defaultValues?.event.capacity,
        deadline_date: defaultValues?.event.time_signup_deadline.split('T')[0],
        deadline_time: defaultDeadlineTime,
        isFull: defaultValues?.event.full,
        image_banner: defaultValues?.event.image_banner,
        image_small: defaultValues?.event.image_small,
        publish_time: defaultPublishTime,
        highlight: defaultValues?.event.highlight,
        link_signup: defaultValues?.event.link_signup,
        release_date: defaultValues?.event.time_signup_release.split('T')[0],
        release_time: defaultReleaseTime,
        link_facebook: defaultValues?.event.link_facebook,
        link_discord: defaultValues?.event.link_discord,
        link_stream: defaultValues?.event.link_stream,
    })

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleEvent)
    }

    return (
        <div className='grid grid-cols-2 gap-y-4 gap-x-8 pt-10 relative'>
            <div
                className={
                    `absolute flex flex-row gap-[1rem] w-full ${mt} ` +
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
                            organization: input.toString(),
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
                    name='audiences'
                    label='Audiences'
                    options={audiences}
                    value={formValues.audiences || ''}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            audiences: Number(input),
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
            <h1 className='text-xl pt-10 col-span-2'>Signup</h1>
            <Input
                name='link_signup'
                type='text'
                label='Signup Link'
                value={formValues.link_signup}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        link_signup: input as string,
                    })
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
                />
            </div>
            <Input
                name='capacity'
                type='number'
                label='Capacity'
                value={formValues.capacity}
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
            <Select
                name='image_banner'
                label='Banner Image'
                options={bannerImages}
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
                options={smallImages}
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
                value={formValues.link_facebook}
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
                value={formValues.link_discord}
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
                value={formValues.link_stream}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        link_stream: input as string,
                    })
                }
                className='col-span-2'
            />
            <Announce />
        </div>
    )
}

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
    category: 2,
    organization: 'NTNU',
    rule: 10,
    location: 1,
    audiences: 1,
    time_type: 'default' as time_type,
    start_date: '2025-09-15',
    end_date: '2025-09-15',
    start_time: '12:00',
    end_time: '13:30',
    publish_date: '2025-08-28',
    default_start_time: '12:00',
    default_end_time: '13:30',
    no_end_start_time: '12:00',
    whole_day: 'false',
    tbd: 'false',
    capacity: 50,
    deadline_date: '2025-09-14',
    deadline_time: '23:59',
    isFull: false,
    image_banner: 'BestePromo.png',
    image_small: 'mnemonic.svg',
    publish_time: '09:00',
    highlight: true,
    link_signup: 'https://login.no/signup/studentlunsj',
    release_date: '2025-08-28',
    release_time: '09:00',
    link_facebook: 'https://www.facebook.com/loginlinjeforeningen/events/',
    link_discord: 'https://discord.gg/login',
    link_stream: 'https://login.no/stream',
}
