'use client'

import DateInput from '@components/inputs/date'
import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import TagInput from '@components/inputs/tag'
import TimeInput from '@components/inputs/time'
import Announce from '@components/announce/announce'
import Button from '@components/userInput/button'
import fallBackDate from '@utils/fallbackDate'
import { useState } from 'react'

export default function JobFormInputsClient({
    defaultValues,
    organizations,
    applicationTypes,
    jobImages,
    preview
}: {
    defaultValues?: GetJobProps
    organizations: Organization[]
    applicationTypes: Application[]
    jobImages: LoginImage[]
    preview?: boolean
}) {
    const [formValues, setFormValues] = useState({
        title_no: defaultValues?.title_no,
        title_en: defaultValues?.title_en,
        position_title_no: defaultValues?.position_title_no,
        position_title_en: defaultValues?.position_title_en,
        description_short_no: defaultValues?.description_short_no,
        description_short_en: defaultValues?.description_short_en,
        description_long_no: defaultValues?.description_long_no || '',
        description_long_en: defaultValues?.description_long_en || '',
        organization: defaultValues?.organization || '',
        banner_image: defaultValues?.banner_image,
        cities: defaultValues?.cities,
        job_type: defaultValues?.job_type,
        skills: defaultValues?.skills,
        time_publish: defaultValues?.time_publish || new Date().toISOString(),
        highlight: defaultValues?.highlight,
        time_expire: defaultValues?.time_expire || fallBackDate('one month'),
        application_url: defaultValues?.application_url,
        application_deadline:
            defaultValues?.application_deadline || fallBackDate('one month'),
    })

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleJob)
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
                name='title_no'
                type='text'
                label='Title (Norwegian)'
                value={formValues.title_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        title_no: input as string,
                    })
                }
                required
            />
            <Input
                name='title_en'
                type='text'
                label='Title (English)'
                value={formValues.title_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        title_en: input as string,
                    })
                }
                required
            />
            <Input
                name='position_title_no'
                type='text'
                label='Position (Norwegian)'
                value={formValues.position_title_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        position_title_no: input as string,
                    })
                }
                required
            />
            <Input
                name='position_title_en'
                type='text'
                label='Position (English)'
                value={formValues.position_title_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        position_title_en: input as string,
                    })
                }
                required
            />
            <Input
                name='description_short_no'
                type='text'
                label='Short Description (Norwegian)'
                value={formValues.description_short_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_short_no: input as string,
                    })
                }
                required
            />
            <Input
                name='description_short_en'
                type='text'
                label='Short Description (English)'
                value={formValues.description_short_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_short_en: input as string,
                    })
                }
                required
            />
            <Markdown
                name='description_long_no'
                label='Description (Norwegian)'
                value={formValues.description_long_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_long_no: input as string,
                    })
                }
                required
            />
            <Markdown
                name='description_long_en'
                label='Description (English)'
                value={formValues.description_long_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_long_en: input as string,
                    })
                }
                required
            />
            <Select
                name='organization'
                label='Organization'
                options={organizations}
                value={formValues.organization}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        organization: input as string,
                    })
                }
                required
            />
            <TagInput
                name='cities'
                label='Cities'
                value={formValues.cities || []}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        cities: input,
                    })
                }
            />
            <Select
                name='job_type'
                label='Application Type'
                options={applicationTypes}
                value={formValues.job_type || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        job_type: input as job_type,
                    })
                }
                required
            />
            <TagInput
                name='skills'
                label='Skills'
                value={formValues.skills || []}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        skills: input,
                    })
                }
            />
            <div className='flex flex-row gap-x-4'>
                <DateInput
                    name='publish_date'
                    label='Publish Date'
                    value={formValues.time_publish.split('T')[0]}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            time_publish: input,
                        })
                    }
                    required
                />
                <TimeInput
                    name='publish_time'
                    label='Publish Time'
                    value={formValues.time_publish
                        .split('T')[1]
                        ?.slice(0, 5)}
                    setValue={(input) =>
                        setFormValues({
                            ...formValues,
                            time_publish: input,
                        })
                    }
                    required
                />
            </div>
            <Switch
                name='highlight'
                label='Highlight Ad'
                value={formValues.highlight || false}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        highlight: input,
                    })
                }
            />
            <div className='flex flex-row gap-x-4'>
                <DateInput
                    name='expire_date'
                    label='Expire Date'
                    value={formValues.time_expire.split('T')[0]}
                    setValue={(date) => {
                        const time =
                            formValues.time_expire.split('T')[1] ??
                            '00:00'
                        setFormValues({
                            ...formValues,
                            time_expire: `${date}T${time}`,
                        })
                    }}
                    required
                />
                <TimeInput
                    name='expire_time'
                    label='Expire Time'
                    value={formValues.time_expire
                        .split('T')[1]
                        ?.slice(0, 5)}
                    setValue={(time) => {
                        const date =
                            formValues.time_expire.split('T')[0] ??
                            new Date().toISOString().split('T')[0]
                        setFormValues({
                            ...formValues,
                            time_expire: `${date}T${time}`,
                        })
                    }}
                    required
                />
            </div>
            <h1 className='text-xl pt-10 col-span-2'>Application</h1>
            <Input
                name='application_url'
                type='text'
                label='Application URL'
                value={formValues.application_url}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        application_url: input as string,
                    })
                }
                className='col-span-2'
                required
            />
            <DateInput
                name='deadline_date'
                label='Deadline Date'
                value={formValues.application_deadline.split('T')[0]}
                setValue={(date) => {
                    const time =
                        formValues.application_deadline.split('T')[1] ??
                        '00:00'
                    setFormValues({
                        ...formValues,
                        application_deadline: `${date}T${time}`,
                    })
                }}
                required
            />
            <TimeInput
                name='deadline_time'
                label='Deadline Time'
                value={formValues.application_deadline
                    .split('T')[1]
                    ?.slice(0, 5)}
                setValue={(time) => {
                    const date =
                        formValues.application_deadline.split('T')[0] ??
                        new Date().toISOString().split('T')[0]
                    setFormValues({
                        ...formValues,
                        application_deadline: `${date}T${time}`,
                    })
                }}
                required
            />
            <h1 className='text-xl pt-10 col-span-2'>Image</h1>
            <Select
                name='banner_image'
                label='Banner Image'
                options={jobImages}
                value={formValues.banner_image || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        banner_image: input as string,
                    })
                }
                className='col-span-2'
                required
            />
            <Announce />
        </div>
    )
}

const sampleJob = {
    title_no: 'UI Designer',
    title_en: 'UI Designer',
    position_title_no: 'UI-designer hos Login',
    position_title_en: 'UI Designer at Login',
    description_short_no:
        'Design og forbedre brukeropplevelsen for Login sitt ' +
        'digitale innhold.',
    description_short_en:
        'Design and improve the user experience for Login’s ' +
        'digital content.',
    description_long_no: `🎨 Som UI-designer hos Login vil du:
- Lage intuitive og attraktive grensesnitt for nettside og app
- Samarbeide tett med markedsføring og arrangementsteam
- Bidra med kreativ input på prosjekter og kampanjer`,
    description_long_en: `🎨 As a UI Designer at Login you will:
- Create intuitive and attractive interfaces for the website and app
- Work closely with marketing and event teams
- Provide creative input on projects and campaigns`,
    organization: 'NTNU',
    banner_image: 'adbanner.png',
    cities: ['Gjøvik'],
    job_type: 'verv' as job_type,
    skills: ['Figma', 'Adobe XD', 'Creativity', 'Attention to detail'],
    time_publish: new Date().toISOString(),
    highlight: true,
    time_expire: fallBackDate('one month'),
    application_url: 'https://login.no/jobs',
    application_deadline: fallBackDate('one month'),
}
