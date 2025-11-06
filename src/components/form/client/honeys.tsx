'use client'

import Input from '@components/inputs/input'
import Button from '@components/button/button'
import { useState } from 'react'
import Select from '@components/inputs/select'
import JsonInput from '@components/inputs/json'

export default function HoneyFormInputsClient({
    defaultValues,
    preview
}: {
    defaultValues?: GetHoneyProps
    preview?: boolean
}) {
    const [formValues, setFormValues] = useState({
        service: defaultValues?.service,
        page: defaultValues?.page,
        language: defaultValues?.language,
        text: defaultValues?.text ? JSON.stringify(JSON.parse(defaultValues.text as unknown as string), null, 4) : '',
    })

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues({
            ...sampleHoney,
            text: JSON.stringify(sampleHoney.text, null, 4)
        })
    }

    return (
        <div className='grid grid-cols-1 gap-y-4 pt-10 relative'>
            <div className={`absolute flex flex-row gap-[1rem] w-full ${mt} justify-end`}>
                <Button
                    color='secondary'
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
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        page: input as string,
                    })
                }
                required
            />
            <Input
                name='service'
                type='text'
                label='Service'
                value={formValues.service}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        service: input as string,
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
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        language: input as string,
                    })
                }
                required
            />
            <JsonInput
                name='text'
                label='Text'
                value={formValues.text}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        text: input,
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
