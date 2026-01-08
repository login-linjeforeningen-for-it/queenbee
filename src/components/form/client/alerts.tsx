'use client'

import { useState } from 'react'
import { Button, Input, Textarea } from 'uibee/components'

export default function RuleFormInputsClient({ defaultValues }: { defaultValues?: GetAlertProps }) {
    const [formValues, setFormValues] = useState({
        title_no: defaultValues?.title_no ?? '',
        title_en: defaultValues?.title_en ?? '',
        description_no: defaultValues?.description_no ?? '',
        description_en: defaultValues?.description_en ?? '',
        service: defaultValues?.service ?? '',
        page: defaultValues?.page ?? '',
    })

    function example() {
        setFormValues(sampleAlert)
    }

    return (
        <div className='grid grid-cols-2 gap-x-8 pt-10 relative'>
            <div className='absolute flex flex-row gap-4 w-full justify-end -mt-13'>
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
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        title_no: e.target.value,
                    })
                }
            />
            <Input
                name='title_en'
                type='text'
                label='Title (English)'
                required
                value={formValues.title_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        title_en: e.target.value,
                    })
                }
            />
            <Textarea
                name='description_no'
                label='Description (Norwegian)'
                type='markdown'
                value={formValues.description_no}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_no: e.target.value,
                    })
                }
                required
            />
            <Textarea
                name='description_en'
                label='Description (English)'
                type='markdown'
                value={formValues.description_en}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        description_en: e.target.value,
                    })
                }
                required
            />
            <Input
                name='service'
                type='text'
                label='Service'
                required
                value={formValues.service}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        service: e.target.value,
                    })
                }
            />
            <Input
                name='page'
                type='text'
                label='Page'
                required
                value={formValues.page}
                onChange={(e) =>
                    setFormValues({
                        ...formValues,
                        page: e.target.value,
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
