'use client'

import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Button from '@components/button/button'
import { useState } from 'react'
import Select from '@components/inputs/select'
import Link from 'next/link'
import { Upload } from 'lucide-react'

export default function AlbumFormInputsClient({
    defaultValues,
    preview,
    type,
    eventsOptions
}: {
    defaultValues?: GetAlbumProps,
    preview?: boolean
    type: 'create' | 'update'
    eventsOptions: Option[]
}) {
    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.name_no ?? '',
        name_en: defaultValues?.name_en ?? '',
        description_no: defaultValues?.description_no ?? '',
        description_en: defaultValues?.description_en ?? '',
        year: defaultValues?.year ?? new Date().getFullYear(),
        event_id: defaultValues?.event?.id ?? null,
        images: [] as File[],
    })

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleAlbum)
    }

    return (
        <div className='grid grid-cols-2 gap-y-4 gap-x-8 pt-10 relative'>
            <div className={
                `absolute flex flex-row gap-4 w-full ${mt} justify-end`
            }>
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
                required
                value={formValues.name_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        name_no: input as string,
                    })
                }
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                required
                value={formValues.name_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        name_en: input as string,
                    })
                }
            />
            <Markdown
                name='description_no'
                label='Description (Norwegian)'
                required
                value={formValues.description_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_no: input as string,
                    })
                }
            />
            <Markdown
                name='description_en'
                label='Description (English)'
                required
                value={formValues.description_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        description_en: input as string,
                    })
                }
            />
            <Input
                name='year'
                type='number'
                label='Year'
                required
                value={formValues.year}
                setValue={(input) => {
                    setFormValues({
                        ...formValues,
                        year: Number(input),
                    })
                }}
            />
            <Select
                name='event_id'
                label='Event'
                options={eventsOptions}
                value={formValues.event_id ?? ''}
                setValue={(input) => {
                    setFormValues({
                        ...formValues,
                        event_id: Number(input),
                    })
                }}
            />
            {type === 'update' &&
                <Link
                    href={`/dashboard/albums/images/${defaultValues?.id}`}
                    className='flex flex-row w-fit gap-2 items-center mt-6 py-2 px-2 bg-login-500 rounded-md'
                >
                    <Upload className='w-5' />
                    Update Images
                </Link>}
        </div>
    )
}

const sampleAlbum = {
    name_no: 'Tekkom på Future Tech',
    name_en: 'Tekkom at Future Tech',
    description_no: 'Tekkom deltok på Future Tech 2025, hvor vi presenterte våre nyeste prosjekter og teknologier.',
    description_en: 'Tekkom participated in Future Tech 2025, where we showcased our latest projects and technologies.',
    year: 2025,
    event_id: 1,
    images: [],
}
