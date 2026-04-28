'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload } from 'lucide-react'
import { Button, Input, Textarea, Select } from 'uibee/components'

export default function AlbumFields({
    defaultValues,
    type,
    eventsOptions
}: {
    defaultValues?: GetAlbumProps,
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

    function example() {
        setFormValues(sampleAlbum)
    }

    return (
        <div className='grid md:grid-cols-2 gap-x-8 pt-10 relative'>
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
                required
                value={formValues.name_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        name_no: e.target.value,
                    })
                }
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                required
                value={formValues.name_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        name_en: e.target.value,
                    })
                }
            />
            <Textarea
                name='description_no'
                label='Description (Norwegian)'
                required
                value={formValues.description_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_no: e.target.value,
                    })
                }
            />
            <Textarea
                name='description_en'
                label='Description (English)'
                required
                value={formValues.description_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_en: e.target.value,
                    })
                }
            />
            <Input
                name='year'
                type='number'
                label='Year'
                required
                value={formValues.year}
                onChange={(e) => {
                    setFormValues({
                        ...formValues,
                        year: Number(e.target.value),
                    })
                }}
            />
            <Select
                name='event_id'
                label='Event'
                options={eventsOptions}
                value={formValues.event_id ?? ''}
                onChange={(value) => {
                    setFormValues({
                        ...formValues,
                        event_id: Number(value),
                    })
                }}
            />
            {type === 'update' &&
                <Link
                    href={`/albums/images/${defaultValues?.id}`}
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
