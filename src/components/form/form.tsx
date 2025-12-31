'use client'

import Form from 'next/form'
import { toast } from 'uibee/components'
import { useActionState, useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from 'uibee/components'

type ContentFormProps = {
    name: FormName
    type: 'create' | 'update'
    id?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formAction: ( prevState: any, formData: FormData ) => any | Promise<any>
    customRedirect?: string
    children: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: any = null

export default function CustomForm({
    name,
    type,
    id,
    formAction,
    customRedirect,
    children
}: ContentFormProps) {
    const [state, action, pending] = useActionState(formAction, initialState)
    const [submitPressed, setSubmitPressed] = useState(false)
    const [submitCount, setSubmitCount] = useState(0)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (typeof state !== 'string' && state !== null) {
            toast.success(`${name} ${type}d successfully!`)
            const basePath = pathname.split('/').slice(0, 2).join('/')
            router.push( state?.id && customRedirect ? `${basePath}/${customRedirect}/${state.id}` : basePath )
        } else if (typeof state === 'string') {
            toast.error(`Error: ${state}`)
        }
    }, [state, submitCount])

    return (
        <Form
            action={action}
            className={`group ${submitPressed ? 'submitPressed' : ''}`}
        >
            <div className='flex flex-col gap-12'>
                <div>
                    {type === 'update' && id != null && (
                        <input type='hidden' name='id' value={String(id)} />
                    )}
                    {children}
                </div>

                <Button
                    type='submit'
                    icon={<Save className='w-5' />}
                    text={`${type} ${name}`}
                    onClick={() => {
                        setSubmitPressed(true)
                        setSubmitCount(prev => prev + 1)
                    }}
                    disabled={pending}
                />
            </div>
        </Form>
    )
}
