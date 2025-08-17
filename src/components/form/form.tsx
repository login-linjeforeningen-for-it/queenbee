'use client'

import { toast } from 'sonner'
import Form from 'next/form'
import { FormState } from './actions'
import { useActionState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

type ContentFormProps = {
    name: 'event' | 'job' | 'organization' | 'location' | 'rule'
    type: 'create' | 'update' | 'duplicate'
    id?: string
    formAction: (prevState: FormState, formData: FormData) => FormState | Promise<FormState>
    children: React.ReactNode
}

const initialState: FormState = null

export default function CustomForm({ name, type, id, formAction, children }: ContentFormProps) {
    const [state, action, pending] = useActionState(formAction, initialState)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (state != null && typeof state === 'object' && Object.keys(state).length > 0 && !('error' in state)) {
            toast.success(`${name} ${type}d successfully!`)
            const basePath = pathname.split('/').slice(0, 3).join('/')
            router.push(basePath)
        } else if (
            state != null &&
            'error' in state &&
            typeof (state as Record<string, unknown>).error === 'string' &&
            (state as Record<string, unknown>).error
        ) {
            toast.error(`Error: ${(state as Record<string, unknown>).error as string}`)
        }
    }, [state])

    return (
        <Form
            action={action}
            className={`group ${state != null && 'error' in state && Boolean((state as Record<string, unknown>).error) ? 'submitted' : ''}`}>
            <div className='flex flex-col gap-12'>
                <div>
                    {type === 'update' && id != null && (
                        <input type='hidden' name='id' value={String(id)} />
                    )}

                    {children}
                </div>

                <button type='submit' disabled={pending} className='flex flex-row w-fit gap-2 capitalize cursor-pointer bg-login/90 hover:bg-login/80 rounded-md px-3 py-1'>
                    <Save className='w-5' />{type} {name}
                </button>
            </div>
        </Form>
    )
}