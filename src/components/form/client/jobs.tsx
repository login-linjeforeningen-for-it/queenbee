'use client'

import Announce from '@components/announce/announce'
import fallBackDate from '@utils/fallbackDate'
import postImage from '@utils/api/workerbee/images/postImage'
import Upload from '@components/inputs/upload'
import { useState } from 'react'
import { toLocalTimeString } from '@utils/timeZone'
import { toast, Button, Input, Textarea, Select, Switch, TagInput } from 'uibee/components'

export default function JobFormInputsClient({
    defaultValues,
    organizations,
    applicationTypes,
    defaultImages,
    channels,
    roles
}: {
    defaultValues?: GetJobProps
    organizations: { label: string; value: number }[]
    applicationTypes: OptionsProps[]
    defaultImages: Option[]
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
        publish_date: defaultValues?.time_publish?.split('T')[0] || '',
        publish_time: toLocalTimeString(defaultValues?.time_publish) || '',
        highlight: defaultValues?.highlight,
        expire_date: defaultValues?.time_expire?.split('T')[0] || '',
        expire_time: toLocalTimeString(defaultValues?.time_expire) || '',
        application_url: defaultValues?.application_url,
    })

    function example() {
        setFormValues(sampleJob)
    }

    return (
        <div className='grid grid-cols-2 gap-x-8 pt-10 relative'>
            <div className='absolute flex flex-row gap-4 w-full justify-end'>
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
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        title_no: e.target.value,
                    })
                }
                required
            />
            <Input
                name='title_en'
                type='text'
                label='Title (English)'
                value={formValues.title_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        title_en: e.target.value,
                    })
                }
                required
            />
            <Input
                name='position_title_no'
                type='text'
                label='Position (Norwegian)'
                value={formValues.position_title_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        position_title_no: e.target.value,
                    })
                }
                required
            />
            <Input
                name='position_title_en'
                type='text'
                label='Position (English)'
                value={formValues.position_title_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        position_title_en: e.target.value,
                    })
                }
                required
            />
            <Input
                name='description_short_no'
                type='text'
                label='Short Description (Norwegian)'
                value={formValues.description_short_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_short_no: e.target.value,
                    })
                }
                required
            />
            <Input
                name='description_short_en'
                type='text'
                label='Short Description (English)'
                value={formValues.description_short_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_short_en: e.target.value,
                    })
                }
                required
            />
            <Textarea
                name='description_long_no'
                label='Description (Norwegian)'
                type='markdown'
                value={formValues.description_long_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_long_no: e.target.value,
                    })
                }
                required
            />
            <Textarea
                name='description_long_en'
                label='Description (English)'
                type='markdown'
                value={formValues.description_long_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_long_en: e.target.value,
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
                        organization: value as string,
                    })
                }
                required
            />
            <TagInput
                name='cities'
                label='Cities'
                value={formValues.cities || []}
                onChange={(input) =>
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
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        job_type_id: Number(value),
                    })
                }
                required
            />
            <TagInput
                name='skills'
                label='Skills'
                value={formValues.skills || []}
                onChange={(input) =>
                    setFormValues({
                        ...formValues,
                        skills: input,
                    })
                }
            />
            <div className='flex flex-row gap-x-4'>
                <Input
                    type='date'
                    name='publish_date'
                    label='Publish Date'
                    value={formValues.publish_date}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            publish_date: e.target.value,
                        })
                    }
                    required
                />
                <Input
                    type='time'
                    name='publish_time'
                    label='Publish Time'
                    value={formValues.publish_time}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            publish_time: e.target.value,
                        })
                    }
                    required
                />
            </div>
            <Switch
                name='highlight'
                label='Highlight Ad'
                checked={formValues.highlight || false}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        highlight: e.target.checked,
                    })
                }
            />
            <div className='flex flex-row gap-x-4'>
                <Input
                    type='date'
                    name='expire_date'
                    label='Expire Date'
                    value={formValues.expire_date}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            expire_date: e.target.value,
                        })
                    }
                    required
                />
                <Input
                    type='time'
                    name='expire_time'
                    label='Expire Time'
                    value={formValues.expire_time}
                    onChange={(e) =>
                        setFormValues({
                            ...formValues,
                            expire_time: e.target.value,
                        })
                    }
                    required
                />
            </div>
            <h1 className='text-xl pt-10 pb-4 col-span-2'>Application</h1>
            <Input
                name='application_url'
                type='text'
                label='URL'
                value={formValues.application_url ?? ''}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        application_url: e.target.value,
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
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        banner_image: value as string,
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
    publish_date: new Date().toISOString().split('T')[0],
    publish_time: '09:00',
    highlight: true,
    expire_date: fallBackDate('one month').split('T')[0],
    expire_time: '23:59',
    application_url: 'https://login.no/jobs',
}
