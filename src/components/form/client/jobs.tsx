'use client'

import DateInput from '@components/inputs/date'
import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Select from '@components/inputs/select'
import Switch from '@components/inputs/switch'
import TagInput from '@components/inputs/tag'
import TimeInput from '@components/inputs/time'
import Announce from '@components/announce/announce'
import fallBackDate from '@utils/fallbackDate'
import postImage from '@utils/api/workerbee/images/postImage'
import Upload from '@components/inputs/upload'
import { useState } from 'react'
import { toLocalTimeString } from '@utils/timeZone'
import { toast } from 'sonner'
import { Button } from 'uibee/components'

export default function JobFormInputsClient({
    defaultValues,
    organizations,
    applicationTypes,
    defaultImages,
    preview,
    channels,
    roles
}: {
    defaultValues?: GetJobProps
    organizations: { label: string; value: number }[]
    applicationTypes: OptionsProps[]
    defaultImages: Option[]
    preview?: boolean
    channels: Channel[]
    roles: Role[]
}) {
    const [images, setImages] = useState<Option[]>(defaultImages)
    const [formValues, setFormValues] = useState({
        title_no: defaultValues?.title_no,
        title_en: defaultValues?.title_en,
        position_title_no: defaultValues?.position_title_no,
        position_title_en: defaultValues?.position_title_en,
        description_short_no: defaultValues?.description_short_no,
        description_short_en: defaultValues?.description_short_en,
        description_long_no: defaultValues?.description_long_no || '',
        description_long_en: defaultValues?.description_long_en || '',
        organization: defaultValues?.organization.id || '',
        banner_image: defaultValues?.banner_image,
        cities: defaultValues?.cities,
        job_type_id: defaultValues?.job_type.id,
        skills: defaultValues?.skills,
        time_publish: defaultValues?.time_publish || new Date().toISOString(),
        highlight: defaultValues?.highlight,
        time_expire: defaultValues?.time_expire || fallBackDate('one month'),
        application_url: defaultValues?.application_url,
    })

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleJob)
    }

    return (
        <div className='grid grid-cols-2 gap-y-4 gap-x-8 pt-10 relative'>
            <div className={`absolute flex flex-row gap-4 w-full ${mt} justify-end`}>
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
                value={formValues.organization || ''}
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
                name='job_type_id'
                label='Application Type'
                options={applicationTypes}
                value={formValues.job_type_id || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        job_type_id: Number(input),
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
                    setValue={(input) => {
                        const time =
                            toLocalTimeString(formValues.time_publish) ||
                            '00:00'
                        setFormValues({
                            ...formValues,
                            time_publish: `${input}T${time}`,
                        })
                    }}
                    required
                />
                <TimeInput
                    name='publish_time'
                    label='Publish Time'
                    value={toLocalTimeString(formValues.time_publish)}
                    setValue={(input) => {
                        const date = formValues.time_publish.split('T')[0] ??
                            new Date().toISOString().split('T')[0]
                        setFormValues({
                            ...formValues,
                            time_publish: `${date}T${input}`,
                        })
                    }}
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
                            toLocalTimeString(formValues.time_expire) ??
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
                    value={toLocalTimeString(formValues.time_expire)}
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
                value={formValues.application_url ?? ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        application_url: input as string,
                    })
                }
                className='col-span-2'
                required
            />
            <h1 className='text-xl pt-10 col-span-2'>Image</h1>
            <Upload
                handleFile={async function (file: File): Promise<void> {
                    const result = await postImage('jobs', file)
                    if (typeof result === 'string') {
                        toast.error(result)
                    } else {
                        toast.success('Image uploaded successfully')
                        const existingImage = images.find(img => img.value === result.image)
                        if (!existingImage) {
                            setImages([
                                ...images,
                                {
                                    label: result.image,
                                    value: result.image,
                                    image: result.image,
                                }
                            ])
                        }
                    }
                }}
            />
            <Select
                name='banner_image'
                label='Banner Image'
                options={images}
                value={formValues.banner_image || ''}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        banner_image: input as string,
                    })
                }
                className='col-span-2'
            />
            <Announce channels={channels} roles={roles} />
        </div>
    )
}

const sampleJob = {
    title_no: 'UI Designer',
    title_en: 'UI Designer',
    position_title_no: 'UI-designer hos Login',
    position_title_en: 'UI Designer at Login',
    description_short_no:
        'Design og forbedre brukeropplevelsen for Login sitt digitale innhold.',
    description_short_en:
        'Design and improve the user experience for Login’s digital content.',
    description_long_no: `🎨 Som UI-designer hos Login vil du:
- Lage intuitive og attraktive grensesnitt for nettside og app
- Samarbeide tett med markedsføring og arrangementsteam
- Bidra med kreativ input på prosjekter og kampanjer`,
    description_long_en: `🎨 As a UI Designer at Login you will:
- Create intuitive and attractive interfaces for the website and app
- Work closely with marketing and event teams
- Provide creative input on projects and campaigns`,
    organization: 1,
    banner_image: 'adbanner.png',
    cities: ['Gjøvik'],
    job_type_id: 1,
    skills: ['Figma', 'Adobe XD', 'Creativity', 'Attention to detail'],
    time_publish: new Date().toISOString(),
    highlight: true,
    time_expire: fallBackDate('one month'),
    application_url: 'https://login.no/jobs',
}
