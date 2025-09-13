'use client'

import Input from '@components/inputs/input'
import Button from '@components/userInput/button'
import { useState } from 'react'

export default function BeeFormedInputsClient({
    defaultValues,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues?: any
}) {
    const [formValues, setFormValues] = useState({
        title: defaultValues?.title ?? '',
    })

    function example() {
        setFormValues(sampleForm)
    }

    return (
        <div className='grid grid-cols-1 gap-y-4 pt-10 relative'>
            <div className='absolute flex flex-row gap-[1rem] w-full -mt-13 justify-end'>
                <Button
                    color='secondary'
                    text='Example'
                    icon='+'
                    onClick={example}
                />
            </div>
            <Input
                name='title'
                type='text'
                label='Title'
                value={formValues.title}
                setValue={(input) =>
                    setFormValues({
                        ...formValues,
                        title: input as string,
                    })
                }
                required
            />
        </div>
    )
}

const sampleForm = {
    title: 'TekKom Gathering',
}
