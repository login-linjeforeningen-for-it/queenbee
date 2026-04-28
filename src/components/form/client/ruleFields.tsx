'use client'

import { useState } from 'react'
import { Button, Input, Textarea } from 'uibee/components'

export default function RuleFields({ defaultValues }: { defaultValues?: GetRuleProps }) {
    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.name_no ?? '',
        name_en: defaultValues?.name_en ?? '',
        description_no: defaultValues?.description_no ?? '',
        description_en: defaultValues?.description_en ?? '',
    })

    function example() {
        setFormValues(sampleRule)
    }

    return (
        <div className='grid grid-cols-2 gap-x-8 pt-10 relative'>
            <div className='absolute flex flex-row gap-4 w-full justify-end -mt-13'>
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
                onChange={(input) =>
                    setFormValues({
                        ...formValues,
                        name_no: input.target.value,
                    })
                }
            />
            <Input
                name='name_en'
                type='text'
                label='Name (English)'
                required
                value={formValues.name_en}
                onChange={(input) =>
                    setFormValues({
                        ...formValues,
                        name_en: input.target.value,
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
        </div>
    )
}

const sampleRule = {
    name_no: '📋 Deltakerretningslinjer',
    name_en: '📋 Participant Guidelines',
    description_no: `✨ Vennligst følg disse retningslinjene under arrangementet:
- Møt opp til avtalt tid ⏰  
- Respekter andre deltakere og arrangører 🤝  
- Følg sikkerhetsinstruksjoner ⚠️  
- Hold området ryddig 🧹  
- Still spørsmål ✅`,
    description_en: `✨ Please follow these guidelines during the event:  
- Arrive on time ⏰  
- Respect other participants and organizers 🤝  
- Follow safety instructions ⚠️  
- Keep the area tidy 🧹  
- Ask questions ✅`,
}
