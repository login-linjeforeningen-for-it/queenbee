'use client'

import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import { useState } from 'react'
import { Button } from 'uibee/components'

export default function RuleFormInputsClient({
    defaultValues,
    preview,
}: {
    defaultValues?: GetAlertProps,
    preview?: boolean
}) {
    const [formValues, setFormValues] = useState({
        title_no: defaultValues?.title_no ?? '',
        title_en: defaultValues?.title_en ?? '',
        description_no: defaultValues?.description_no ?? '',
        description_en: defaultValues?.description_en ?? '',
        service: defaultValues?.service ?? '',
        page: defaultValues?.page ?? '',
    })

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleAlert)
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
                name='title_no'
                type='text'
                label='Title (Norwegian)'
                required
                value={formValues.title_no}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        title_no: input as string,
                    })
                }
            />
            <Input
                name='title_en'
                type='text'
                label='Title (English)'
                required
                value={formValues.title_en}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        title_en: input as string,
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
                name='service'
                type='text'
                label='Service'
                required
                value={formValues.service}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        service: input as string,
                    })
                }
            />
            <Input
                name='page'
                type='text'
                label='Page'
                required
                value={formValues.page}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        page: input as string,
                    })
                }
            />
        </div>
    )
}

const sampleAlert = {
    title_no: 'Vedlikehold pågår',
    title_en: 'Maintenance in progress',
    description_no: 'Vi utfører vedlikehold på systemet vårt. Tjenesten vil være utilgjengelig i omtrent 30 minutter.',
    description_en: 'We are performing maintenance on our system. The service will be unavailable for approximately 30 minutes.',
    service: 'beehive',
    page: '/',
}
