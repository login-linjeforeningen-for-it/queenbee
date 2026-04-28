'use client'

import { useState } from 'react'
import { Button, Input, Textarea, Select } from 'uibee/components'

export default function HoneyFields({ defaultValues }: { defaultValues?: GetHoneyProps }) {
    const [formValues, setFormValues] = useState({
        service: defaultValues?.service,
        page: defaultValues?.page,
        language: defaultValues?.language,
        text: defaultValues?.text ? JSON.stringify(JSON.parse(defaultValues.text as unknown as string), null, 4) : '',
    })

    function example() {
        setFormValues({
            ...sampleHoney,
            text: JSON.stringify(sampleHoney.text, null, 4)
        })
    }

    return (
        <div className='grid grid-cols-1 pt-10 relative'>
            <div className='absolute flex flex-row gap-4 w-full justify-end -mt-13'>
                <Button
                    variant='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>
            <Input
                name='page'
                type='text'
                label='Page'
                value={formValues.page}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        page: e.target.value,
                    })
                }
                required
            />
            <Input
                name='service'
                type='text'
                label='Service'
                value={formValues.service}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        service: e.target.value,
                    })
                }
                required
            />
            <Select
                name='language'
                label='Language'
                options={[
                    { label: 'English', value: 'en' },
                    { label: 'Norwegian', value: 'no' }
                ]}
                value={formValues.language ?? 'en'}
                onChange={(value) =>
                    setFormValues({
                        ...formValues,
                        language: value as string,
                    })
                }
                required
            />
            <Textarea
                name='text'
                label='Text'
                type='json'
                value={formValues.text}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        text: e.target.value,
                    })
                }
                required
            />
        </div>
    )
}

const sampleHoney = {
    service: 'beehive',
    page: '/albums',
    language: 'en',
    text: {
        title: 'Albums',
        description: 'Discover our collection of albums featuring our events.',
    },
}
