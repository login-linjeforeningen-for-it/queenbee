'use client'

import Input from '@components/inputs/input'
import Markdown from '@components/inputs/markdown'
import Button from '@components/userInput/button'
import { useState } from 'react'

export default function RuleFormInputsClient({ defaultValues }: { defaultValues?: GetRuleProps }) {
    const [formValues, setFormValues] = useState({
        name_no: defaultValues?.name_no ?? '',
        name_en: defaultValues?.name_en ?? '',
        description_no: defaultValues?.description_no ?? '',
        description_en: defaultValues?.description_en ?? ''
    })

    function example() {
        setFormValues(sampleRule)
    }

    return (
        <div className='flex flex-col gap-4 relative'>
            <div className='absolute flex flex-row gap-[1rem] -mt-13 w-full justify-end'>
                <Button color="secondary" text='Example' icon='+' onClick={example} />
            </div>
            <div className='flex flex-row gap-8 justify-between w-full'>
                <Input
                    name='name_no'
                    type='text'
                    label='Name (Norwegian)'
                    required
                    value={formValues.name_no}
                    setValue={(input) => setFormValues({ ...formValues, name_no: input as string })}
                />
                <Input
                    name='name_en'
                    type='text'
                    label='Name (English)'
                    required
                    value={formValues.name_en}
                    setValue={(input) => setFormValues({ ...formValues, name_en: input as string })}
                />
            </div>
            <div className='flex flex-row gap-8 justify-between w-full'>
                <Markdown
                    name='description_no'
                    label='Description (Norwegian)'
                    required
                    value={formValues.description_no}
                    setValue={(input) => setFormValues({ ...formValues, description_no: input as string })}
                />
                <Markdown
                    name='description_en'
                    label='Description (English)'
                    required
                    value={formValues.description_en}
                    setValue={(input) => setFormValues({ ...formValues, description_en: input as string })}
                />
            </div>
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
- Ask questions ✅`
}
