'use client'

import { toast } from 'sonner'
import Form from 'next/form'
import { FormState } from './actions'
import { useActionState, useEffect } from 'react'
import { Save } from 'lucide-react'

type ContentFormProps = {
    name: 'event' | 'job' | 'organization' | 'location' | 'rule'
    type: 'create' | 'update' | 'duplicate'
    formAction: (prevState: FormState, formData: FormData) => FormState | Promise<FormState>
    children: React.ReactNode
}

const initialState: FormState = {}

export default function CustomForm({ name, type, formAction, children }: ContentFormProps) {
    const [state, action, pending] = useActionState(formAction, initialState)

    useEffect(() => {
        if (typeof state === 'object' && Object.keys(state).length > 0 && !('error' in state)) {
            toast.success(`${name} ${type}d successfully!`)
        } else if ('error' in state && state.error) {
            toast.error(`Error: ${state.error}`)
        }
    }, [state])

    return (
        <Form action={action} className={`group ${'error' in state && state.error ? 'submitted' : ''}`}>
            <div className='flex flex-col gap-12'>
                <div>
                    {children}
                </div>

                <button type='submit' disabled={pending} className='flex flex-row w-fit gap-2 capitalize cursor-pointer bg-login/90 hover:bg-login/80 rounded-md px-3 py-1'>
                    <Save className='w-5' />{type} {name}
                </button>
            </div>
        </Form>
    )
}