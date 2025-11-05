'use client'

import Input from '@components/inputs/input'
import Button from '@components/button/button'
import { useState } from 'react'

export default function HoneyFormInputsClient({
    defaultValues,
    preview
}: {
    defaultValues?: GetHoneyProps
    preview?: boolean
}) {
    const [formValues, setFormValues] = useState({
        page: defaultValues?.page,
    })

    const mt = preview ? '-mt-12' : '-mt-13'

    function example() {
        setFormValues(sampleHoney)
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
        </div>
    )
}

const sampleHoney = {
    page: '/albums',
}
